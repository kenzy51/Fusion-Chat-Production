import { 
  SubscribeMessage, 
  WebSocketGateway, 
  OnGatewayConnection,
} from "@nestjs/websockets";
import { ChatService } from "../gemini/chat.service";
import * as crypto from 'crypto';

@WebSocketGateway({ path: '/chat-stream', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: any) {
    client.id = crypto.randomUUID();
    console.log(`📡 New Web Chat Socket Connected: ${client.id}`);

    const defaultTestTenantId = "66708b76e1a47b2c93d9ef12"; 

    const tenantConfig = await this.chatService.getTenantConfig(defaultTestTenantId);
    const greeting = tenantConfig?.voiceConfig?.greeting || "Hello! How can I help you today?";

    client.send(JSON.stringify({
      event: 'session_established',
      sessionId: client.id,
      greeting: greeting
    }));
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
    const data = parsed.data || parsed; 
    
    const tenantId = data.tenantId; 
    // Extract the persistent conversation session identifier cleanly
    const sessionId = data.sessionId || client.id;
    
    if (!tenantId) {
      client.send(JSON.stringify({ event: 'error', data: 'Missing tenant identifier.' }));
      return;
    }

    // 🚀 THE FIX: Passed sessionId into the required 4th parameter position (conversationId)
    const aiResponse = await this.chatService.generateTextOnlyResponse(
      data.text,
      data.history || [],
      tenantId,
      sessionId
    );

    client.send(JSON.stringify({
      event: 'ai_response',
      data: aiResponse
    }));

    const currentMessageWindow = [
      ...(data.history || []),
      { role: 'user', content: data.text },
      { role: 'assistant', content: aiResponse }
    ];

    this.chatService.logSessionToDatabase(sessionId, currentMessageWindow, tenantId)
      .catch(err => console.error(`❌ Delayed DB Session log failed:`, err));
  }
}