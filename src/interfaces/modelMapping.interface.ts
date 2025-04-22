import { Prisma } from '@prisma/client';

export interface IModelMappingsForWhere {
  Member: Prisma.MemberWhereInput;
  Member_session: Prisma.Member_sessionWhereInput;
  Member_access_rule: Prisma.Member_access_ruleWhereInput;
  Committee: Prisma.CommitteeWhereInput;
}
