/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './session.service'; // Ensure your callsService is renamed/updated to SessionsService
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * 📊 GET /sessions?tenantId=abc
   * Fetches all chat sessions bound securely to a specific company/tenant node.
   * Crucial for the Next.js business dashboard.
   */
  @Get()
  // @UseGuards(JwtAuthGuard) 
  async getTenantSessions(@Query('tenantId') tenantId: string) {
    if (!tenantId) {
      throw new NotFoundException(
        'A valid tenantId query parameter is mandatory.',
      );
    }
    // Repurposes your old 'getHistoryByBusiness' database logic safely using tenantId
    return this.sessionsService.getHistoryByTenant(tenantId);
  }

  /**
   * 🔍 GET /sessions/:sessionId
   * Fetches the complete metadata, summary, and full conversational transcript for a singular chat.
   */
  @Get(':sessionId')
  async getSessionDetails(@Param('sessionId') sessionId: string) {
    const session = await this.sessionsService.findBySessionId(sessionId);
    if (!session) {
      throw new NotFoundException(
        `Chat session thread [${sessionId}] could not be located.`,
      );
    }
    return session;
  }

  /**
   * 🔒 PATCH /sessions/:sessionId/status
   * Dynamically shifts chat states (e.g. marking a chat 'completed', 'abandoned', or 'human_escalated').
   * Connects perfectly to the future live takeover feature flag!
   */
  @Patch(':sessionId/status')
  @HttpCode(HttpStatus.OK)
  async updateSessionStatus(
    @Param('sessionId') sessionId: string,
    @Body('status') status: string,
  ) {
    const validStatuses = [
      'active',
      'completed',
      'abandoned',
      'human_escalated',
    ];
    if (!validStatuses.includes(status)) {
      throw new NotFoundException(`Invalid status transition parameter.`);
    }

    const updatedSession = await this.sessionsService.updateStatus(
      sessionId,
      status,
    );
    if (!updatedSession) {
      throw new NotFoundException(`Target session context missing.`);
    }
    return { status: 'success', data: updatedSession };
  }

  @Patch(':sessionId/flag')
  async flagSession(
    @Param('sessionId') sessionId: string,
    @Body('isFlagged') isFlagged: boolean,
  ) {
    return this.sessionsService.updateFlagState(sessionId, isFlagged);
  }
}
