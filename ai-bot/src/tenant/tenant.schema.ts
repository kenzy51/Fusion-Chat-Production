import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ChatConfig {
  @Prop({ default: 'Hello, welcome to our website! How can we assist you today?' }) 
  greeting: string;

  @Prop({ default: 'You are a helpful automated assistant.' }) 
  chatPrompt: string;

  @Prop({ default: '' }) 
  knowledgeBase: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ type: Object, default: {} })
  departments: Record<string, string>;
}

@Schema({ timestamps: true })
export class Tenant extends Document {
  @Prop({ required: true, unique: true, index: true })
  slug: string; 

  @Prop({ required: true })
  name: string;

  @Prop({ type: ChatConfig, default: () => ({}) })
  chatConfig: ChatConfig;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);