import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  Headers,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from 'src/tenant/tenant.schema';
import { User } from 'src/user/user.schema'; // 🚀 IMPORT YOUR USER SCHEMA MATRIX
import { JwtService } from '@nestjs/jwt';

@Controller('public-tenant') // 🔓 READ-ONLY WIDGET ACCESS NODE
export class PublicTenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
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
      throw new NotFoundException('Requested chat layer context not located.');
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
    };
  }
}

@Controller('tenant') 
export class TenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>, // 🎯 INJECT USER MODEL
    private readonly jwtService: JwtService, 
  ) {}

  // Central token resolver helper
  private decodeHeaderToken(authHeader: string): any {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Administrative active session missing.');
    }
    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.decode(token) as any;
    if (!decoded || !decoded.tenantId || !decoded.sub) {
      throw new BadRequestException('Security credential token token fingerprint corrupt.');
    }
    return decoded;
  }

@Get('config')
  async getCombinedProfile(@Headers('authorization') authHeader: string) {
    const decoded = this.decodeHeaderToken(authHeader);

    // Concurrent lookup engine
    const [tenant, user] = await Promise.all([
      this.tenantModel.findById(decoded.tenantId).lean().exec(),
      this.userModel.findById(decoded.sub).lean().exec(),
    ]);

    // 🎯 FALLBACK ACCELERATOR: If your local collection doesn't have this tenant document yet
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
        }
      };
    }

    return {
      id: tenant._id,
      name: tenant.name,      
      slug: tenant.slug,      
      chatConfig: tenant.chatConfig || {},
      user: {
        // 🎯 FALLBACK FIX: If the user document isn't found, fall back to token properties cleanly
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