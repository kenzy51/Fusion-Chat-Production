import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Groq } from 'groq-sdk';

const groq = new Groq();

@Controller('chats')
export class ChatsController {

  /**
   * 💬 POST /chats/preview-message
   * Real-time playground engine powered by ultra-fast Groq infrastructure
   */
  @Post('preview-message')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard) // 🔒 Protected via administration token guards
  async previewMessage(@Body() body: any) {
    const { message, chatPrompt, knowledgeBase } = body;

    try {
      // 🧠 Splice system parameters and prompt restrictions clean
      const systemInstruction = `
        ${chatPrompt}

        Use ONLY the following knowledge base data to answer the user's question. 
        If the answer cannot be confidently deduced from the knowledge base below, politely say you don't have that information.

        ---
        KNOWLEDGE BASE CONTEXT:
        ${knowledgeBase}
      `;

      // ⚡ Execute rapid completion using Llama-3.1-8B on Groq for sub-second speeds
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: message },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.2, // Low temperature keeps it tightly anchored to your facts
        max_tokens: 512,
      });

      // 🏁 Return payload to the preview frontend layout view
      return {
        reply: chatCompletion.choices[0]?.message?.content || "No matrix data returned from the cluster model node.",
      };

    } catch (error) {
      console.error('Groq compilation execution failed:', error);
      return {
        reply: "System pipeline compilation error. Verify your backend GROQ_API_KEY token configuration.",
      };
    }
  }
}