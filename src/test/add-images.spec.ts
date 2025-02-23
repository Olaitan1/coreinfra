import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from 'src/card-request/card-request.service';
// import { CarsService, NotFoundException } from './cars.service';

describe('CarsService', () => {
  let service: CarsService;
  let mockCarModel: any;

  beforeEach(async () => {
    mockCarModel = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsService, { provide: 'CarModel', useValue: mockCarModel }],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  it('should add images to an existing car', async () => {
    const carId = '123abc';
    const imageUrls = ['image1.jpg', 'image2.png'];
    mockCarModel.findById.mockReturnValueOnce({ _id: carId, images: [] });

    const updatedCar = await service.addImagesToCar(carId, imageUrls);

    expect(mockCarModel.findById).toHaveBeenCalledWith(carId);
    expect(updatedCar.images).toEqual(imageUrls);
    expect(mockCarModel.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if car does not exist', async () => {
    const carId = '123abc';
    const imageUrls = ['image1.jpg', 'image2.png'];
    mockCarModel.findById.mockReturnValueOnce(null);

    expect.assertions(1);
    try {
      await service.addImagesToCar(carId, imageUrls);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
