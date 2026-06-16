import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';

@Controller('tenant')
export class TenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * 📊 GET /tenant/config
   * Returns complete isolation parameters: Business Name + Admin Identity Profile Context
   */
  @Get('config')
  @UseGuards(JwtAuthGuard) // 🔒 Extracted sub (userId) and tenantId securely from token
  async getCombinedProfile(@Req() req: any) {
    const { userId, tenantId } = req.user;

    // Fetch both documents concurrently via parallel database compilation promises
    const [tenant, user] = await Promise.all([
      this.tenantModel.findById(tenantId).lean().exec(),
      this.userModel.findById(userId).lean().exec(),
    ]);

    if (!tenant || !user) {
      return { name: 'Fusion Space', chatConfig: {}, user: { name: 'Admin Node', email: '' } };
    }

    // 🏁 Return combined data tree to your frontend layout components
    return {
      id: tenant._id,
      name: tenant.name,          // 🏢 Business Name (e.g. AI-SOUL)
      chatConfig: tenant.chatConfig,
      user: {
        name: user.name,          // 👤 Personal Admin Name (e.g. Lazat Akilova)
        email: user.email,        // ✉️ Admin Corporate Email
        role: user.role,
      }
    };
  }
}