import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
import { Param, NotFoundException } from '@nestjs/common';

@Controller('public-tenant') // 🔓 PUBLIC INSTANCE ACCESS LAYER
export class PublicTenantController {
  constructor(private readonly tenantModel: Model<Tenant>) {}

  /**
   * 🌐 GET /public-tenant/:slug/widget-config
   * Triggered by the embedded script to draw visual colors and setups anonymously
   */
  @Get(':slug/widget-config')
  async getPublicWidgetConfig(@Param('slug') slug: string) {
    const tenant = await this.tenantModel.findOne({ slug }).lean().exec();

    if (!tenant) {
      throw new NotFoundException('Target infrastructure context not located.');
    }

    // Return ONLY safe public visual parameters — never leak system prompts or keys!
    return {
      name: tenant.name,
      slug: tenant.slug,
      primaryColor: tenant.chatConfig?.primaryColor || '#d4ff33',
      backgroundColor: tenant.chatConfig?.backgroundColor || '#000000',
      widgetTitle: tenant.chatConfig?.widgetTitle || 'AI Assistant',
      greeting: tenant.chatConfig?.greeting || 'Hello!',
      logoUrl: tenant.chatConfig?.logoUrl || '',
    };
  }
}
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
      return {
        name: 'Fusion Space',
        chatConfig: {},
        user: { name: 'Admin Node', email: '' },
      };
    }

    // 🏁 Return combined data tree to your frontend layout components
    return {
      id: tenant._id,
      name: tenant.name, // 🏢 Business Name (e.g. AI-SOUL)
      chatConfig: tenant.chatConfig,
      user: {
        name: user.name, // 👤 Personal Admin Name (e.g. Lazat Akilova)
        email: user.email, // ✉️ Admin Corporate Email
        role: user.role,
      },
    };
  }
  @Patch('update-config')
  @UseGuards(JwtAuthGuard) // 🔒 Protect it so only authenticated admins can update configs
  async updateConfig(@Req() req: any, @Body() body: any) {
    const { tenantId } = req.user;
    const { chatConfig } = body;

    // Direct atomic lookup and update inside MongoDB Atlas
    const updatedTenant = await this.tenantModel
      .findByIdAndUpdate(
        tenantId,
        {
          $set: {
            // Updates parameters without resetting non-provided layout fields
            'chatConfig.knowledgeBase': chatConfig.knowledgeBase,
            'chatConfig.chatPrompt': chatConfig.chatPrompt,
            'chatConfig.greeting': chatConfig.greeting,
            'chatConfig.primaryColor': chatConfig.primaryColor,
            'chatConfig.backgroundColor': chatConfig.backgroundColor,
            'chatConfig.widgetTitle': chatConfig.widgetTitle,
          },
        },
        { new: true }, // Return the fresh document copy
      )
      .lean()
      .exec();

    if (!updatedTenant) {
      throw new NotFoundException(
        'Failed to update: Tenant structure not located.',
      );
    }

    return {
      success: true,
      message: 'Neural brand metrics safely synchronized.',
      chatConfig: updatedTenant.chatConfig,
    };
  }
}
