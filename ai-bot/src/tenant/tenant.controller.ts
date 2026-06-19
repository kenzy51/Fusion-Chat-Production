import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
import { Param, NotFoundException } from '@nestjs/common';
import { Groq } from 'groq-sdk';

const groq = new Groq();

@Controller('public-tenant') // 🔓 PUBLIC INSTANCE ACCESS LAYER (No AuthGuard)
export class PublicTenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
  ) {}

  /**
   * 💬 POST /public-tenant/message
   * Anonymous endpoint serving external web requests without session locks
   */
  @Post('message')
  @HttpCode(HttpStatus.OK)
  async publicWidgetMessage(@Body() body: { message: string; slug: string }) {
    const { message, slug } = body;

    const tenant = await this.tenantModel.findOne({ slug }).lean().exec();
    if (!tenant) {
      throw new NotFoundException('Inbound routing identifier node mismatch.');
    }

    try {
      const systemInstruction = `
        ${tenant.chatConfig?.chatPrompt || 'You are a helpful assistant.'}
        Use ONLY the following knowledge facts context to answer:
        ${tenant.chatConfig?.knowledgeBase || ''}
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: message },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.2,
        max_tokens: 512,
      });

      return {
        reply:
          chatCompletion.choices[0]?.message?.content ||
          'Connection timeout stream anomaly.',
      };
    } catch (error) {
      return { reply: 'Engine down. Please try again later.' };
    }
  }

  /**
   * 🌐 GET /public-tenant/:slug/widget-config
   * Fetches branding parameters for external DOM initialization anchors safely
   */
  @Get(':slug/widget-config')
  async getPublicWidgetConfig(@Param('slug') slug: string) {
    const tenant = await this.tenantModel.findOne({ slug }).lean().exec();

    if (!tenant) {
      throw new NotFoundException('Target infrastructure context not located.');
    }

    return {
      name: tenant.name,
      slug: tenant.slug,
      primaryColor: tenant.chatConfig?.primaryColor || '#d4ff33',
      backgroundColor: tenant.chatConfig?.backgroundColor || '#000000',
      textColor: tenant.chatConfig?.textColor || '#ffffff', // 🚀 Added to match your frontend customizer
      widgetTitle: tenant.chatConfig?.widgetTitle || 'AI Assistant',
      greeting: tenant.chatConfig?.greeting || 'Hello!',
      logoUrl: tenant.chatConfig?.logoUrl || '',
    };
  }
}

@Controller('tenant') // 🔒 PROTECTED ADMINISTRATION MODULES
export class TenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Get('config')
  @UseGuards(JwtAuthGuard)
  async getCombinedProfile(@Req() req: any) {
    if (!req.user) {
      throw new UnauthorizedException(
        'Authentication footprint context missing.',
      );
    }

    const { userId, tenantId } = req.user;

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

    return {
      id: tenant._id,
      name: tenant.name,
      chatConfig: tenant.chatConfig,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
  @Patch('update-config')
  // @UseGuards(JwtAuthGuawrd)
  async updateConfig(@Req() req: any, @Body() body: any) {
    // 🎯 SAFETY BOUNDARY CHECK: Ensure user session context was successfully populated by the Guard
    if (!req.user) {
      throw new UnauthorizedException(
        'Action rejected: Active workspace session state is invalid or expired. Please re-login.',
      );
    }

    const { tenantId } = req.user;
    const { chatConfig } = body;

    if (!tenantId) {
      throw new BadRequestException(
        'Context verification failure: Missing explicit tenant identity anchor.',
      );
    }

    const updatedTenant = await this.tenantModel
      .findByIdAndUpdate(
        tenantId,
        {
          $set: {
            'chatConfig.knowledgeBase': chatConfig.knowledgeBase,
            'chatConfig.chatPrompt': chatConfig.chatPrompt,
            'chatConfig.greeting': chatConfig.greeting,
            'chatConfig.primaryColor': chatConfig.primaryColor,
            'chatConfig.backgroundColor': chatConfig.backgroundColor,
            'chatConfig.textColor': chatConfig.textColor,
            'chatConfig.widgetTitle': chatConfig.widgetTitle,
          },
        },
        { new: true },
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
