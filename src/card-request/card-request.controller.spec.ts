import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardRequestService } from './card-request.service';
import {
  CardRequest,
  CardRequestDocument,
  CardStatus,
} from '../schemas/card-request.schema';
import {
  CreateCardRequestDto,
  FilterCardsDto,
  UpdateCardRequestDto,
} from './dto/card-request.dto';
import { NotFoundException } from '@nestjs/common';

const mockCardRequest = {
  _id: '64b4b5e0c9d4b74a3c6a4e1c',
  cardType: 'Visa',
  expiration: new Date(),
  binPrefix: '123456',
  currency: 'USD',
  initiator: 'admin123',
  status: CardStatus.PENDING,
};

const mockCardRequestModel = {
  create: jest.fn().mockResolvedValue(mockCardRequest),
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockCardRequest]),
  }),
  findById: jest.fn().mockImplementation((id) => ({
    exec: jest
      .fn()
      .mockResolvedValue(id === mockCardRequest._id ? mockCardRequest : null),
  })),
};

describe('CardRequestService', () => {
  let service: CardRequestService;
  let model: Model<CardRequestDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardRequestService,
        {
          provide: getModelToken(CardRequest.name),
          useValue: mockCardRequestModel,
        },
      ],
    }).compile();

    service = module.get<CardRequestService>(CardRequestService);
    model = module.get<Model<CardRequestDocument>>(
      getModelToken(CardRequest.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a card request', async () => {
    const dto: CreateCardRequestDto = {
      cardType: 'Visa',
      binPrefix: '123456',
      currency: 'USD',
      branch: '',
      quantity: 0,
      cardName: 'name',
      description: 'string',
      expiration: 1,
    };
    const result = await service.createCardRequest(
      dto,
      'admin123',
      'userId',
      dto.expiration,
    );
    expect(result).toEqual(mockCardRequest);
    expect(model.create).toHaveBeenCalledWith({
      ...dto,
      initiator: 'admin123',
    });
  });

 it('should return all card requests based on filters', async () => {
   const filters: FilterCardsDto = {
     status: CardStatus.PENDING,
     batch: 'BATCH-123',
     startDate: new Date('2025-01-01'),
   };

   const mockFind = jest.fn().mockReturnValue({
     exec: jest.fn().mockResolvedValue([mockCardRequest]),
   });

   jest.spyOn(model, 'find').mockImplementation(mockFind);

   const result = await service.getAllCardRequests(filters);

   expect(result).toEqual([mockCardRequest]);
   expect(model.find).toHaveBeenCalledWith({
     status: filters.status,
     batchNumber: { $regex: filters.batch, $options: 'i' },
     expiration: { $gte: filters.startDate },
   });
 });

  it('should update card request status', async () => {
    const updateDto: UpdateCardRequestDto = { status: CardStatus.READY };
    mockCardRequest.status = updateDto.status;

    const result = await service.updateCardRequestStatus(
      mockCardRequest._id,
      updateDto,
    );
    expect(result.status).toEqual(CardStatus.READY);
  });

  it('should throw NotFoundException when updating a non-existent request', async () => {
    await expect(
      service.updateCardRequestStatus('invalid_id', {
        status: CardStatus.READY,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
