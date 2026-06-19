import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatConfig {
  @Prop({ default: '' })
  knowledgeBase: string;

  @Prop({ default: '' })
  chatPrompt: string;

  @Prop({ default: 'Hello! How can I assist you today?' })
  greeting: string;

  // 🎨 NEW BRANDING ASSETS
  @Prop({ default: '#d4ff33' }) // Fusion neon lime default primary accent
  primaryColor: string;

  @Prop({ default: '#000000' }) // Base window backdrop
  backgroundColor: string;

  @Prop({ default: 'Fusion Bot' }) // Title text on top of widget window
  widgetTitle: string;

  @Prop({ default: '' }) // Optional company custom logo URL string
  logoUrl: string;
  textColor: string;
}

@Schema({ timestamps: true })
export class Tenant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: ChatConfig, default: () => ({}) })
  chatConfig: ChatConfig;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);