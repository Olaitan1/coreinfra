import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from 'src/card-request/card-request.service';
import { CreateCarDto } from 'src/card-request/dto/card-request.dto';
// import { CarsService } from './cars.service';
// import { CreateCarDto } from './dto/cars.dto';

describe('CarsService', () => {
  let service: CarsService;
  let mockCarModel: any;

  beforeEach(async () => {
    mockCarModel = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsService, { provide: 'CarModel', useValue: mockCarModel }],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  it('should create a new car', async () => {
    const createCarDto: CreateCarDto = {
      make: 'Tesla',
      models: 'Model S',
      year: 2023,
      mileage: 10000,
      price: 50000,
      description: 'A luxurious electric car',
      isAvailable: true,
    };
    const sellerId = '12345';

    const savedCar = await service.createCar(createCarDto, sellerId);

    expect(mockCarModel.save).toHaveBeenCalledWith({
      ...createCarDto,
      seller: sellerId,
    });
    expect(savedCar).toEqual(expect.any(Object));
  });
});
