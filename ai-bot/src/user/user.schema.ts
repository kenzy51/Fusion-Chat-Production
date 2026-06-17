import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  // 🎯 FIXED: Changed from passwordHash to password to match your AuthController!
  @Prop({ required: true })
  password: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
  })
  tenantId: string;

  @Prop({ enum: ['admin', 'agent'], default: 'admin' })
  role: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ required: false })
  emailVerificationToken?: string;

  @Prop({ required: false })
  passwordResetToken?: string;

  @Prop({ required: false })
  passwordResetExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);