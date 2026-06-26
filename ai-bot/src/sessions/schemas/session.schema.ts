// backend/src/sessions/schemas/session.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatSessionDocument = ChatSession & Document;

@Schema({ collection: 'sessions', timestamps: true })
export class ChatSession {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop({ default: 'Web Chat End User' })
  endUserIp: string;

  @Prop({ default: '' })
  summary: string;

  @Prop({ default: '' })
  transcript: string;

  @Prop({ default: 'active' })
  status: string;

  // 🎯 EXPLICIT CORE LEAD PROPERTIES
  @Prop({ type: String, default: null })
  fullName: string | null;

  @Prop({ type: String, default: null })
  phone: string | null;

  @Prop({ type: String, default: null })
  email: string | null;

  // 🎯 UNIFIED COMPACT MULTI-TENANT LEAD OBJECT CONTAINER
  @Prop({
    type: {
      fullName: { type: String, default: null },
      phone: { type: String, default: null },
      email: { type: String, default: null },
      capturedStatus: { type: String, default: 'anonymous' }
    },
    _id: false,
    default: { fullName: null, phone: null, email: null, capturedStatus: 'anonymous' }
  })
  leadMetadata: {
    fullName: string | null;
    phone: string | null;
    email: string | null;
    capturedStatus: string;
  };
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);