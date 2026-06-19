import { OnGatewayConnection } from "@nestjs/websockets";
import { ChatService } from "../gemini/chat.service";
export declare class ChatGateway implements OnGatewayConnection {
    private readonly chatService;
    constructor(chatService: ChatService);
    handleConnection(client: any): Promise<void>;
    handleMessage(client: any, payload: any): Promise<void>;
}
