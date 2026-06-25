// backend/src/ai-agent/gemini/chat.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import Groq from 'groq-sdk';
import sgMail from '@sendgrid/mail';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant } from 'src/tenant/tenant.schema';
import { ChatSession } from 'src/sessions/schemas/session.schema';
import { SessionsService } from 'src/sessions/session.service';

@Injectable()
export class ChatService implements OnModuleInit {
  private groq: Groq;

  constructor(
    private readonly sessionsService: SessionsService,
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(ChatSession.name) private readonly sessionModel: Model<ChatSession>,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async onModuleInit() {
    console.log('🚀 Fusion Chat Engine Activated. Database Tenancy Bound.');
  }

  /**
   * 🚀 STEP 1: Process User Form Submission (Explicit or Skipped)
   * Stores or updates lead data fields for an active conversationId.
   */
  async recordFormAction(
    businessId: string,
    conversationId: string,
    formData?: { fullName?: string; phone?: string; email?: string },
  ): Promise<any> {
    const leadData = formData || {};
    const status = formData?.fullName && (formData.phone || formData.email) ? 'qualified' : 'anonymous';

    // Cast-proof lookup bounding logic
    const isObjectId = Types.ObjectId.isValid(businessId);
    const tenantFilter = isObjectId 
      ? { _id: businessId } 
      : { slug: { $regex: new RegExp(`^${businessId.trim()}$`, 'i') } };

    const currentTenant = await this.tenantModel.findOne(tenantFilter).exec();
    const tenantSlug = currentTenant ? currentTenant.slug : businessId;

    // Persist and update lead parameters safely
    return await this.sessionModel.findOneAndUpdate(
      { sessionId: conversationId },
      {
        $set: {
          tenantId: currentTenant?._id || null,
          tenantSlug,
          'leadMetadata.fullName': leadData.fullName || null,
          'leadMetadata.phone': leadData.phone || null,
          'leadMetadata.email': leadData.email || null,
          'leadMetadata.capturedStatus': status,
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  /**
   * 🚀 STEP 2: Generates a text response and records message transcripts into the exact same document.
   */
  async generateTextOnlyResponse(
    userText: string,
    passedHistory: any[],
    businessId: string,
    conversationId: string,
  ): Promise<string> {
    const leanHistory = passedHistory.slice(-10);

    try {
      // Validate business ID properties
      const isObjectId = Types.ObjectId.isValid(businessId);
      const tenantFilter = isObjectId 
        ? { _id: businessId } 
        : { slug: { $regex: new RegExp(`^${businessId.trim()}$`, 'i') } };

      const currentTenant = await this.tenantModel.findOne(tenantFilter).exec();

      if (!currentTenant) {
        return 'System error: Tenant configuration node not found.';
      }

      const dynamicKnowledge = currentTenant.chatConfig?.knowledgeBase || '';
      const dynamicSystemChatPrompt = currentTenant.chatConfig?.chatPrompt || 'You are a helpful assistant.';
      const tenantSlug = currentTenant.slug || businessId;

      // Get precision completion from Groq Llama Gateway
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `${dynamicSystemChatPrompt}\n\n# KNOWLEDGE BASE\n${dynamicKnowledge}\n`,
          },
          ...leanHistory,
          { role: 'user', content: userText },
        ],
        temperature: 0.5,
      });

      const aiReply = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that response.";

      // UNIFIED MONGO RECORD UPDATE: Appends message turns to the document holding the lead markers
      await this.sessionModel.findOneAndUpdate(
        { sessionId: conversationId },
        {
          $setOnInsert: {
            tenantId: currentTenant._id,
            tenantSlug: tenantSlug,
            'leadMetadata.capturedStatus': 'anonymous',
            'leadMetadata.fullName': null,
            'leadMetadata.phone': null,
            'leadMetadata.email': null,
            status: 'active',
          },
          $push: {
            messages: {
              $each: [
                { role: 'user', content: userText, timestamp: new Date() },
                { role: 'assistant', content: aiReply, timestamp: new Date() },
              ],
            },
          },
        },
        { upsert: true, returnDocument: 'after' },
      );

      // Out-of-band analysis triggers unconditionally on every turn to capture continuous trace flow
      const structuralFullHistory = [
        ...passedHistory, 
        { role: 'user', content: userText }, 
        { role: 'assistant', content: aiReply }
      ];
      
      this.logSessionToDatabase(conversationId, structuralFullHistory, currentTenant._id.toString()).catch((err) =>
        console.error('Out-of-band transcription trace save stall error:', err),
      );

      return aiReply;
    } catch (err) {
      console.error('❌ Groq Dynamic Multi-Tenant Chat Error:', err);
      return "I'm having trouble connecting to the systems database. Please try again in a moment.";
    }
  }

  async getTenantConfig(tenantId: string): Promise<any> {
    const isObjectId = Types.ObjectId.isValid(tenantId);
    const filter = isObjectId ? { _id: tenantId } : { slug: tenantId };
    return await this.tenantModel.findOne(filter).exec();
  }

  /**
   * 🚀 STEP 3: Logs summaries asynchronously back to MongoDB and synchronizes session tracking flags.
   */
  async logSessionToDatabase(
    conversationId: string,
    history: any[],
    tenantId: string,
  ) {
    try {
      let summary = 'Chat Inquiry';

      if (history.length >= 2) {
        const sumResp = await this.groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'Summarize this conversation context in one brief professional executive summary sentence.',
            },
            {
              role: 'user',
              content: history.map((h) => `${h.role}: ${h.content}`).join('\n'),
            },
          ],
        });
        summary = sumResp.choices[0]?.message?.content || summary;
      }

      // Synchronize data down to the secondary historical reporting layer
      await this.sessionsService.saveSession({
        tenantId,
        sessionId: conversationId,
        endUserIp: 'Web Chat End User',
        summary,
        transcript: history.map((h) => `${h.role}: ${h.content}`).join('\n'),
        status: 'completed',
      });

      // Updates the core tracking collection document record with the generated insights summary
      await this.sessionModel.updateOne(
        { sessionId: conversationId },
        { $set: { aiSummary: summary, isArchived: true, status: 'completed' } }
      );

      console.log(`✅ Multi-Tenant Chat Session saved and summarized securely for tenant: ${tenantId}`);
    } catch (e: any) {
      console.error('❌ Async Chat Session Save failed:', e.message);
    }
  }
}