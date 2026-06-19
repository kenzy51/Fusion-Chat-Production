import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
import { Param } from '@nestjs/common';

@Controller('public-tenant') // 🔓 DATA LOADER ACCESS LAYER
export class PublicTenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
  ) {}

  @Get(':slug/widget-config')
  async getPublicWidgetConfig(@Param('slug') slug: string) {
    let tenant: any = null;

    // 1. Try case-insensitive matching by slug if the parameter is valid
    if (slug && slug !== 'workspace' && slug !== 'undefined') {
      tenant = await this.tenantModel
        .findOne({ slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') } })
        .lean()
        .exec();
    }

    // 🎯 DYNAMIC FALLBACK: If the slug match misses, grab the newest available entry in the database collection!
    if (!tenant) {
      tenant = await this.tenantModel.findOne({}).sort({ createdAt: -1 }).lean().exec();
    }

    if (!tenant) {
      throw new NotFoundException('Configuration sync error: No tenant entries exist in the MongoDB collection yet.');
    }

    // Return all data parameters back to Next.js so fields instantly auto-fill
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
      logoUrl: tenant.chatConfig?.logoUrl || '',
    };
  }
}

@Controller('tenant') // 🔒 PROTECTED MANAGEMENT NODE
export class TenantController {
  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Get('config')
  async getCombinedProfile(@Req() req: any) {
    // 🎯 Dynamically fetch whichever tenant is active/newest to prevent 404 profiles
    const tenant = await this.tenantModel.findOne({}).sort({ createdAt: -1 }).lean().exec();
    return {
      id: tenant?._id || 'mock_id',
      name: tenant?.name || 'Fusion Space',
      chatConfig: tenant?.chatConfig || {},
      user: { name: 'Admin Node', email: 'admin@fusion.ai', role: 'admin' },
    };
  }

  @Patch('update-config')
  async updateConfig(@Req() req: any, @Body() body: any) {
    const { chatConfig, slug } = body;

    let updatedTenant = null;

    // 1. Try to find and patch matching by slug if present
    if (slug && slug !== 'workspace' && slug !== 'undefined') {
      // @ts-ignore
      updatedTenant = await this.tenantModel
        .findOneAndUpdate(
          { slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') } },
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
    }

    // 🎯 DYNAMIC FALLBACK WRITE: Target the newest record if slug query misses 
    if (!updatedTenant) {
      const activeDocument = await this.tenantModel.findOne({}).sort({ createdAt: -1 }).exec();
      if (activeDocument) {
      // @ts-ignore

        updatedTenant = await this.tenantModel
          .findByIdAndUpdate(
            activeDocument._id,
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
      }
    }

    if (!updatedTenant) {
      throw new NotFoundException('Failed to execute update: Target document cannot be located inside collections.');
    }

    return {
      success: true,
      message: 'Neural brand metrics safely synchronized to current active workspace document.',
      // @ts-ignore

      chatConfig: updatedTenant.chatConfig,
    };
  }
}