// backend/src/tenant/schemas/widget-config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WidgetConfigDocument = WidgetConfig & Document;

// 🚀 Industry standard: Export an explicit TypeScript type for validation pipelines
export type LeadFormPolicy = 'mandatory' | 'optional' | 'disabled';

@Schema({ timestamps: true })
export class WidgetConfig {
  @Prop({ required: true })
  tenantSlug: string;

  // 🎯 THE FIX: Explicitly enforce the enum on the MongoDB driver layer
  @Prop({
    type: String,
    enum: ['mandatory', 'optional', 'disabled'],
    default: 'optional',
  })
  leadFormPolicy: LeadFormPolicy;

  @Prop({ default: 'AI Assistant' })
  widgetTitle: string;

  @Prop({ default: 'Hello! How can I assist you today?' })
  greeting: string;

  @Prop({ default: '#d4ff33' })
  primaryColor: string;

  @Prop({ default: '#0a0a0a' })
  backgroundColor: string;

  @Prop({ default: '#ffffff' })
  textColor: string;
}

export const WidgetConfigSchema = SchemaFactory.createForClass(WidgetConfig);