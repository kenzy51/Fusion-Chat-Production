// backend/src/ai-agent/gemini/chat.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import Groq from 'groq-sdk';
import sgMail from '@sendgrid/mail';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // 🚀 FIXED: Imported "Types" to handle structural ObjectId validation checks
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
   */
  async recordFormAction(
    businessId: string,
    conversationId: string,
    formData?: { fullName?: string; phone?: string; email?: string },
  ): Promise<any> {
    const leadData = formData || {};
    const status = formData?.fullName && (formData.phone || formData.email) ? 'qualified' : 'anonymous';

    // 🎯 FIXED: Cast-proof lookup boundary routing
    const isObjectId = Types.ObjectId.isValid(businessId);
    const tenantFilter = isObjectId 
      ? { _id: businessId } 
      : { slug: { $regex: new RegExp(`^${businessId.trim()}$`, 'i') } };

    const currentTenant = await this.tenantModel.findOne(tenantFilter).exec();
    const tenantSlug = currentTenant ? currentTenant.slug : businessId;

    return await this.sessionModel.findOneAndUpdate(
      { sessionId: conversationId },
      {
        $set: {
          tenantId: currentTenant?._id || null,
          tenantSlug,
          leadMetadata: {
            fullName: leadData.fullName || null,
            phone: leadData.phone || null,
            email: leadData.email || null,
            capturedStatus: status,
          },
        },
      },
      { upsert: true, returnDocument: 'after' }, // 🚀 FIXED: Cleans up deprecated 'new: true' warning arrays
    );
  }

  /**
   * 🚀 STEP 2: Generates a text response and streams conversation states into MongoDB storage.
   */
  async generateTextOnlyResponse(
    userText: string,
    passedHistory: any[],
    businessId: string,
    conversationId: string,
  ): Promise<string> {
    const leanHistory = passedHistory.slice(-10);

    try {
      // 🎯 CRITICAL FIX: Evaluate if the businessId is a valid 24-char Hex ObjectId before throwing it at the database filter
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

      // Get precision completion from Groq
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

      // Sync persistent transaction data seamlessly
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
        { upsert: true, returnDocument: 'after' }, // 🚀 FIXED: Replaced deprecation metrics markers
      );

      // Trigger asynchronous background analysis if conversion signatures match
      if (userText.toLowerCase().includes('book') || aiReply.includes('/contact')) {
        const structuralFullHistory = [
          ...passedHistory, 
          { role: 'user', content: userText }, 
          { role: 'assistant', content: aiReply }
        ];
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
    const isObjectId = Types.ObjectId.isValid(tenantId);
    const filter = isObjectId ? { _id: tenantId } : { slug: tenantId };
    return await this.tenantModel.findOne(filter).exec();
  }

  /**
   * Logs conversational analytics asynchronously back to MongoDB when a session completes
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

      await this.sessionsService.saveSession({
        tenantId,
        sessionId: conversationId,
        endUserIp: 'Web Chat End User',
        summary,
        transcript: history.map((h) => `${h.role}: ${h.content}`).join('\n'),
        status: 'completed',
      });

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