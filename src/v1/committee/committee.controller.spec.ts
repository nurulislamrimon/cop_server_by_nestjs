import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeController } from './committee.controller';
import { CommitteeService } from './committee.service';

describe('CommitteeController', () => {
  let controller: CommitteeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitteeController],
      providers: [CommitteeService],
    }).compile();

    controller = module.get<CommitteeController>(CommitteeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
