import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/schemas/user.schema';
import { CardRequestService } from './card-request.service';
import {
  CreateCardRequestDto,
  FilterCardsDto,
  UpdateCardRequestDto,
} from './dto/card-request.dto';
import { Request } from 'express';

@Controller('card-requests')
export class CardRequestController {
  constructor(private readonly cardRequestService: CardRequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async createCardRequest(
    @Body() createCardRequestDto: CreateCardRequestDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const user = req.user.role;
    const initiator = req.user.id;
    if (user !== UserRole.Admin) {
      throw new ForbiddenException('Only admins can create card requests');
    }
    await this.cardRequestService.createCardRequest(
      createCardRequestDto,
      user,
      initiator,
      createCardRequestDto.expiration,
    );

    return {
      message: 'Card request submitted successfully',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async getAllCardRequests(@Query() filters: FilterCardsDto) {
    return this.cardRequestService.getAllCardRequests(filters);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async updateCardRequestStatus(
    @Param('id') requestId: string,
    @Body() updateDto: UpdateCardRequestDto,
  ) {
    return this.cardRequestService.updateCardRequestStatus(
      requestId,
      updateDto,
    );
  }
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async getOneCardRequests(@Param('id') cardRequestId: string) {
    return this.cardRequestService.getSingleCardRequest(cardRequestId);
  }
}
