// backend/src/chat/public-tenant.controller.ts
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Headers,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from 'src/tenant/tenant.schema';
import { User } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/ai-agent/gemini/chat.service';

@Controller('public-tenant')
export class PublicTenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    private readonly chatService: ChatService,
  ) {}

  @Get(':slug/widget-config')
  async getPublicWidgetConfig(@Param('slug') slug: string) {
    if (!slug || slug === 'undefined' || slug === 'workspace') {
      throw new BadRequestException('Workspace tracking parameters invalid.');
    }

    const tenant = await this.tenantModel
      .findOne({ slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') } })
      .lean()
      .exec();

    if (!tenant) {
      return {
        name: 'AI Support Node',
        slug: slug.toLowerCase().trim(),
        primaryColor: '#d4ff33',
        backgroundColor: '#0a0a0a',
        textColor: '#ffffff',
        widgetTitle: 'AI Support Assistant',
        greeting: 'Hello! Setting up configurations. How can I help you today?',
        knowledgeBase: '',
        chatPrompt: '',
        leadFormPolicy: 'optional', // Default fail-safe fallback metric configuration rule
      };
    }

    return {
      name: tenant.name,
      slug: tenant.slug,
      primaryColor: tenant.chatConfig?.primaryColor || '#d4ff33',
      backgroundColor: tenant.chatConfig?.backgroundColor || '#0a0a0a',
      textColor: tenant.chatConfig?.textColor || '#ffffff',
      widgetTitle: tenant.chatConfig?.widgetTitle || 'AI Assistant',
      greeting: tenant.chatConfig?.greeting || 'Hello!',
      knowledgeBase: tenant.chatConfig?.knowledgeBase || '',
      chatPrompt: tenant.chatConfig?.chatPrompt || '',
      // @ts-ignore
      leadFormPolicy: tenant.chatConfig?.leadFormPolicy || 'optional',
    };
  }

  /**
   * 🚀 NEW ENDPOINT: Initializes and records form capture configurations (Mandatory / Optional Skips)
   */
  @Post('initialize-lead')
  async initializeLead(
    @Body('tenantSlug') tenantSlug: string,
    @Body('conversationId') conversationId: string,
    @Body('formData') formData?: { fullName?: string; phone?: string; email?: string },
  ) {
    if (!tenantSlug || !conversationId) {
      throw new BadRequestException('Initialization transaction rejected: Missing critical tracking parameters.');
    }
    return await this.chatService.recordFormAction(tenantSlug, conversationId, formData);
  }

  @Post('message')
  async handleIncomingWidgetMessage(
    @Body() body: { message: string; slug: string; conversationId: string; history?: any[] },
  ) {
    const { message, slug, conversationId, history } = body;

    if (!slug || !conversationId) {
      throw new BadRequestException(
        'Cannot initiate matrix lookup: Missing tenant validation tokens.',
      );
    }

    const tenant = await this.tenantModel
      .findOne({ slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') } })
      .lean()
      .exec();

    if (!tenant) {
      throw new NotFoundException(
        'The requested business profile workspace does not exist.',
      );
    }

    try {
      const passedHistoryArray = history || [];
      
      const aiReply = await this.chatService.generateTextOnlyResponse(
        message,
        passedHistoryArray,
        tenant._id.toString(),
        conversationId,
      );

      return {
        reply: aiReply,
        conversationId,
      };
    } catch (error) {
      console.error('Public UI Widget Inference pipeline crash:', error);
      return {
        reply: "I'm having trouble connecting to my systems array right now. Please try again shortly!",
        conversationId,
      };
    }
  }
}

@Controller('tenant')
export class TenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private decodeHeaderToken(authHeader: string): any {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Administrative active session missing.');
    }
    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.decode(token) as any;
    if (!decoded || !decoded.tenantId || !decoded.sub) {
      throw new BadRequestException(
        'Security credential token fingerprint corrupt.',
      );
    }
    return decoded;
  }

  @Get('config')
  async getCombinedProfile(@Headers('authorization') authHeader: string) {
    const decoded = this.decodeHeaderToken(authHeader);

    const [tenant, user] = await Promise.all([
      this.tenantModel.findById(decoded.tenantId).lean().exec(),
      this.userModel.findById(decoded.sub).lean().exec(),
    ]);

    if (!tenant) {
      const fallbackTenant = await this.tenantModel.findOne({}).lean().exec();
      return {
        id: fallbackTenant?._id || 'mock_tenant_id',
        name: fallbackTenant?.name || 'Fusion Space (Failsafe)',
        slug: fallbackTenant?.slug || 'test',
        chatConfig: fallbackTenant?.chatConfig || {},
        user: {
          name: user?.name || 'Test User (No DB Match)',
          email: user?.email || 'test@gmail.com',
          role: user?.role || 'admin',
        },
      };
    }

    return {
      id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      chatConfig: {
        ...tenant.chatConfig,
        // @ts-ignore
        leadFormPolicy: tenant.chatConfig?.leadFormPolicy || 'optional',
      },
      user: {
        name: user?.name || 'Admin Node',
        email: user?.email || decoded.email || 'unknown@gmail.com',
        role: user?.role || decoded.role || 'admin',
      },
    };
  }

  @Patch('update-config')
  async updateConfig(
    @Headers('authorization') authHeader: string,
    @Body() body: any,
  ) {
    const decoded = this.decodeHeaderToken(authHeader);
    const { chatConfig } = body;

    const updatedTenant = await this.tenantModel
      .findByIdAndUpdate(
        decoded.tenantId,
        {
          $set: {
            'chatConfig.knowledgeBase': chatConfig.knowledgeBase,
            'chatConfig.chatPrompt': chatConfig.chatPrompt,
            'chatConfig.greeting': chatConfig.greeting,
            'chatConfig.primaryColor': chatConfig.primaryColor,
            'chatConfig.backgroundColor': chatConfig.backgroundColor,
            'chatConfig.textColor': chatConfig.textColor,
            'chatConfig.widgetTitle': chatConfig.widgetTitle,
            'chatConfig.leadFormPolicy': chatConfig.leadFormPolicy || 'optional', // Saves custom policy state cleanly
          },
        },
        { new: true },
      )
      .lean()
      .exec();

    return {
      success: true,
      message: 'Workspace branding parameters successfully synchronized.',
      // @ts-ignore
      chatConfig: updatedTenant.chatConfig,
    };
  }
}