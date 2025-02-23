import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CardRequest,
  CardRequestDocument,
} from '../schemas/card-request.schema';
import {
  CreateCardRequestDto,
  FilterCardsDto,
  UpdateCardRequestDto,
} from './dto/card-request.dto';

@Injectable()
export class CardRequestService {
  constructor(
    @InjectModel(CardRequest.name)
    private cardRequestModel: Model<CardRequestDocument>,
  ) {}
  private generateBatchNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return `BATCH-${timestamp}-${randomSuffix}`;
  }

  async createCardRequest(
    createCardRequestDto: CreateCardRequestDto,
    userRole: string,
    userId: string,
    expirationYears: number,
  ): Promise<CardRequest> {
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can create card requests');
    }
    if (expirationYears <= 0) {
      throw new ForbiddenException(
        'Expiration period must be greater than 0 years',
      );
    }

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + expirationYears);

    const batchNumber = this.generateBatchNumber();

    const cardRequest = new this.cardRequestModel({
      ...createCardRequestDto,
      expiration: expirationDate,
      batchNumber,
      status: 'pending',
      initiator: userId,
    });

    return await cardRequest.save();
  }
  async getAllCardRequests(filters: FilterCardsDto): Promise<CardRequest[]> {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.branch) {
      query.branch = filters.branch;
    }

    if (filters.batch) {
      query.batchNumber = { $regex: filters.batch, $options: 'i' }; 
    }

    if (filters.startDate) {
      query.expiration = { $gte: filters.startDate };
    }

    if (filters.endDate) {
      query.expiration = query.expiration
        ? { ...query.expiration, $lte: filters.endDate }
        : { $lte: filters.endDate };
    }

    if (filters.startDate) {
      query.expiration = { $lt: filters.startDate };
    }

    if (filters.endDate) {
      query.expiration = query.expiration
        ? { ...query.expiration, $gt: filters.endDate }
        : { $gt: filters.endDate };
    }

    return this.cardRequestModel.find(query).exec();
  }

  async getSingleCardRequest(cardRequestId: string): Promise<CardRequest> {
    const cardRequest: CardRequestDocument = await this.cardRequestModel
      .findById(cardRequestId)
      .exec();

    if (!cardRequest) {
      throw new NotFoundException('Card request not found.');
    }

    return cardRequest;
  }

  async updateCardRequestStatus(
    cardRequestId: string,
    updateDto: UpdateCardRequestDto,
  ): Promise<CardRequest> {
    const cardRequest: CardRequestDocument = await this.cardRequestModel
      .findById(cardRequestId)
      .exec();

    if (!cardRequest) {
      throw new NotFoundException('Card request not found.');
    }

    cardRequest.status = updateDto.status;
    return cardRequest.save();
  }
}
