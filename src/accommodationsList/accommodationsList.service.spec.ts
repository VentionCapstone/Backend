import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsListService } from './accommodationsList.service';

describe('AccommodationService', () => {
  let service: AccommodationsListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccommodationsListService],
    }).compile();

    service = module.get<AccommodationsListService>(AccommodationsListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
