import { Test, TestingModule } from '@nestjs/testing';
import { ProfileCustomerService } from './profile_customer.service';

describe('ProfileCustomerService', () => {
  let service: ProfileCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileCustomerService],
    }).compile();

    service = module.get<ProfileCustomerService>(ProfileCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
