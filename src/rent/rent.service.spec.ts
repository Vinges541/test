import { Test, TestingModule } from '@nestjs/testing';
import { RentService } from './rent.service';

describe('RentService', () => {
  let service: RentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentService],
    }).compile();

    service = module.get<RentService>(RentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 1000', () => {
    expect(service.calculateCost(1)).toEqual(1000);
  });

  it('should return 5900', () => {
    expect(service.calculateCost(6)).toEqual(5900);
  });

  it('should return 12350', () => {
    expect(service.calculateCost(13)).toEqual(12350);
  });

  it('should return 22750', () => {
    expect(service.calculateCost(25)).toEqual(22750);
  });
});
