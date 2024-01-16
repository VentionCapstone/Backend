import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProfileController } from './customer_profile.controller';
import { CustomerProfileService } from './customer_profile.service';

describe('CustomerProfileController', () => {
  let controller: CustomerProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerProfileController],
      providers: [CustomerProfileService],
    }).compile();

    controller = module.get<CustomerProfileController>(CustomerProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
