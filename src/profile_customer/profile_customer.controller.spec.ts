import { Test, TestingModule } from '@nestjs/testing';
import { ProfileCustomerController } from './profile_customer.controller';
import { ProfileCustomerService } from './profile_customer.service';

describe('ProfileCustomerController', () => {
  let controller: ProfileCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileCustomerController],
      providers: [ProfileCustomerService],
    }).compile();

    controller = module.get<ProfileCustomerController>(ProfileCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
