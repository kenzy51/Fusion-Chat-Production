import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true }) // Automatically manages createdAt & updatedAt metrics
export class Conversation {
  @Prop({ required: true, unique: true })
  conversationId: string; // The UUID generated during the frontend handshake

  @Prop({ required: true, index: true })
  tenantSlug: string; 

  @Prop({
    type: {
      fullName: { type: String, default: null },
      phone: { type: String, default: null },
      email: { type: String, default: null },
      capturedStatus: { type: String, enum: ['anonymous', 'partial', 'qualified'], default: 'anonymous' }
    },
    _id: false
  })
  leadMetadata: {
    fullName: string | null;
    phone: string | null;
    email: string | null;
    capturedStatus: string;
  };

  @Prop({
    type: [{
      role: { type: String, enum: ['user', 'assistant', 'system'] },
      content: { type: String },
      timestamp: { type: Date, default: Date.now }
    }],
    _id: false
  })
  messages: Array<{
    role: string;
    content: string;
    timestamp: Date;
  }>;

  // 🧠 THE AI-GENERATED SUMMARY INSIGHT
  @Prop({ default: 'In progress...' })
  aiSummary: string;

  @Prop({ default: false, index: true })
  isArchived: boolean; // Marked true once the out-of-band summarization executes
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Create compound index optimization to make tenant lookups lightning fast
ConversationSchema.index({ tenantSlug: 1, createdAt: -1 });