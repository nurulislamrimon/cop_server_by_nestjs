import { Test, TestingModule } from '@nestjs/testing';
import { MemberSessionController } from './member-session.controller';
import { MemberSessionService } from './member-session.service';

describe('MemberSessionController', () => {
  let controller: MemberSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberSessionController],
      providers: [MemberSessionService],
    }).compile();

    controller = module.get<MemberSessionController>(MemberSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
