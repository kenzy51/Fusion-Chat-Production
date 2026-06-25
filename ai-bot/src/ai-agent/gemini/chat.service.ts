// backend/src/chat/chat.service.ts
import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import Groq from 'groq-sdk';
import sgMail from '@sendgrid/mail';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
   * This handles creating the session placeholder or merging explicit lead data fields.
   */
  async recordFormAction(
    businessId: string,
    conversationId: string,
    formData?: { fullName?: string; phone?: string; email?: string },
  ): Promise<any> {
    // Determine status variant tracking parameters based on data fields presence
    const leadData = formData || {};
    const status = formData?.fullName && (formData.phone || formData.email) ? 'qualified' : 'anonymous';

    // Atomically find the current tenant record to bind correctly
    const currentTenant = await this.tenantModel
      .findOne({ $or: [{ _id: businessId }, { slug: businessId }] })
      .exec();

    const tenantSlug = currentTenant ? currentTenant.slug : businessId;

    // Persist or merge profile context fields cleanly within our active collections
    return await this.sessionModel.findOneAndUpdate(
      { sessionId: conversationId },
      {
        $set: {
          tenantId: currentTenant?._id || businessId,
          tenantSlug,
          leadMetadata: {
            fullName: leadData.fullName || null,
            phone: leadData.phone || null,
            email: leadData.email || null,
            capturedStatus: status,
          },
        },
      },
      { upsert: true, new: true },
    );
  }

  /**
   * 🚀 STEP 2: Generates a text response and streams conversation states into MongoDB storage.
   */
  async generateTextOnlyResponse(
    userText: string,
    passedHistory: any[],
    businessId: string,
    conversationId: string, // 💥 CRITICAL: Map your persistent session token identifier over the wire
  ): Promise<string> {
    const leanHistory = passedHistory.slice(-10);

    try {
      // Direct lookups inside your MongoDB multi-tenant metrics fields
      const currentTenant = await this.tenantModel
        .findOne({ $or: [{ _id: businessId }, { slug: businessId }] })
        .exec();

      if (!currentTenant) {
        return 'System error: Tenant configuration node not found.';
      }

      const dynamicKnowledge = currentTenant.chatConfig?.knowledgeBase || '';
      const dynamicSystemChatPrompt = currentTenant.chatConfig?.chatPrompt || 'You are a helpful assistant.';
      const tenantSlug = currentTenant.slug || businessId;

      // Request text completion parameters via Groq Llama Gateway
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

      // 💥 SYNC PERSISTENT COLLECTION TIER: Update text logs without creating ghost session gaps
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
        { upsert: true, new: true },
      );

      // Trigger asynchronous background analysis if specific conversion keywords drop
      if (userText.toLowerCase().includes('book') || aiReply.includes('/contact')) {
        const structuralFullHistory = [...passedHistory, { role: 'user', content: userText }, { role: 'assistant', content: aiReply }];
        this.logSessionToDatabase(conversationId, structuralFullHistory, currentTenant._id.toString()).catch((err) =>
          console.error('Out-of-band transcription trace save stall error:', err),
        );
      }

      return aiReply;
    } catch (err) {
      console.error('❌ Groq Dynamic Multi-Tenant Chat Error:', err);
      return "I'm having trouble connecting to the systems database. Please try again in a moment.";
    }
  }

  async getTenantConfig(tenantId: string): Promise<any> {
    return await this.tenantModel.findById(tenantId).exec();
  }

  /**
   * Logs summary analytics out-of-band cleanly without interrupting active user chat windows
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
              content: 'Summarize this conversation context in one brief, professional executive summary sentence.',
            },
            {
              role: 'user',
              content: history.map((h) => `${h.role}: ${h.content}`).join('\n'),
            },
          ],
        });
        summary = sumResp.choices[0]?.message?.content || summary;
      }

      // Finalize the compiled thread records persistently via the session controller
      await this.sessionsService.saveSession({
        tenantId,
        sessionId: conversationId,
        endUserIp: 'Web Chat End User',
        summary,
        transcript: history.map((h) => `${h.role}: ${h.content}`).join('\n'),
        status: 'completed',
      });

      // Update the active model archive flag to avoid double summarizations later
      await this.sessionModel.updateOne(
        { sessionId: conversationId },
        { $set: { aiSummary: summary, isArchived: true, status: 'completed' } }
      );

      console.log(`✅ Multi-Tenant Chat Session saved and summarized securely for tenant: ${tenantId}`);
    } catch (e) {
      console.error('❌ Async Chat Session Save failed:', e.message);
    }
  }
}