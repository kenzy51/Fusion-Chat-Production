import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto'; // 🚀 ДОБАВЬТЕ ЭТОТ ИМПОРТ
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    private readonly jwtService: JwtService,
  ) {}

  async registerTenantAccount(dto: any) {
    const existingUser = await this.userModel
      .findOne({ email: dto.email })
      .exec();
    if (existingUser) {
      throw new BadRequestException(
        'This email is already associated with an account.',
      );
    }

    // 🚀 Start a managed transaction database session
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      // 1. Provision the business tenant space within the session context
      const newTenant = new this.tenantModel({
        name: dto.businessName,
        slug: dto.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        chatConfig: {},
      });
      const savedTenant = await newTenant.save({ session });

      // 2. Hash raw credential
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(dto.password, salt);

      // 3. Create the administrator user bound tightly to the new tenantId
      const newUser = new this.userModel({
        name: dto.name,
        email: dto.email,
        password: passwordHash, // 🎯 Matches the updated schema
        tenantId: savedTenant._id, // 🚀 FIXED: Привязываем созданного пользователя к ID компании
        role: 'admin',
        isEmailVerified: false, // Флаг верификации по умолчанию false
        emailVerificationToken: crypto.randomBytes(32).toString('hex'),
      });
      await newUser.save({ session });

      // 🏁 Commit the transaction to disk if both writes succeed perfectly
      await session.commitTransaction();
      return { status: 'success', tenantId: savedTenant._id };
    } catch (error) {
      // 🛑 Abort transaction and clear out partial data if anything cracks mid-flight
      await session.abortTransaction();
      console.error(
        '❌ Tenant registration rolled back due to error:',
        error.message,
      );
      throw new BadRequestException(
        'Workspace provisioning aborted due to an internal system fault.',
      );
    } finally {
      // 🔒 Always clean up and close the database session lifecycle
      await session.endSession();
    }
  }

  /**
   * Validates credentials and signs a payload containing the secure tenant context anchor
   */
  async login(dto: any) {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    if (!user) throw new BadRequestException('Invalid credentials.');

    // 🎯 FIXED: Изменено с user.passwordHash на user.password, чтобы соответствовать схеме
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials.');

    // Дополнительная проверка на верификацию email (если внедрили эту логику)
    if (user.isEmailVerified === false) {
      throw new BadRequestException(
        'Please verify your email before logging in.',
      );
    }

    const payload = {
      sub: user._id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
