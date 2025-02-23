import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from 'src/card-request/card-request.service';
import { FilterCarsDto } from 'src/card-request/dto/card-request.dto';

describe('CarsService', () => {
  let service: CarsService;
  let mockCarModel: any;

  beforeEach(async () => {
    mockCarModel = {
      find: jest.fn(),
      sort: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsService, { provide: 'CarModel', useValue: mockCarModel }],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  it('should get all cars without filters', async () => {
    const filterDto: FilterCarsDto = {};

    await service.getCars(filterDto);

    expect(mockCarModel.find).toHaveBeenCalled();
    expect(mockCarModel.sort).not.toHaveBeenCalled();
    expect(mockCarModel.exec).toHaveBeenCalled;
  });
});
