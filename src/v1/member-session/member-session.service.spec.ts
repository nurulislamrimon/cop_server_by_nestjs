import { Test, TestingModule } from '@nestjs/testing';
import { MemberSessionService } from './member-session.service';

describe('MemberSessionService', () => {
  let service: MemberSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberSessionService],
    }).compile();

    service = module.get<MemberSessionService>(MemberSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
