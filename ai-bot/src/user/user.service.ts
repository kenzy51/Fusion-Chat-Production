import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(tenantId: string, name: string, email: string, cleartextPassword: string, role: string = 'ADMIN') {
    // 💡 FIX: Query by email to match your actual database schema property mapping
    const exists = await this.userModel.findOne({ email }).exec();
    if (exists) {
      throw new BadRequestException('This email is already taken');
    }

    const hashedPassword = await bcrypt.hash(cleartextPassword, 12);

    const newUser = new this.userModel({
      tenantId,
      name,
      email,
      passwordHash: hashedPassword, // Make sure this matches user.schema.ts (e.g. passwordHash)
      role,
    });

    const savedUser = await newUser.save();
    
    return { 
      id: savedUser._id, 
      email: savedUser.email, 
      role: savedUser.role 
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}