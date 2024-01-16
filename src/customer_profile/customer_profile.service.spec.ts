import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProfileService } from './customer_profile.service';

describe('CustomerProfileService', () => {
  let service: CustomerProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerProfileService],
    }).compile();

    service = module.get<CustomerProfileService>(CustomerProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
