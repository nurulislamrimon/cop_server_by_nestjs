import { Injectable } from '@nestjs/common';
import { Committee_type_enum } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllData() {
    const valid = {
      OR: [{ valid_till: { gt: new Date() } }, { valid_till: null }],
    };
    const [members, director, committee] = await Promise.all([
      this.prisma.member.count({ where: { is_active: true } }),
      this.prisma.committee.count({
        where: {
          AND: [valid, { type_of_committee: Committee_type_enum.director }],
        },
      }),
      this.prisma.committee.count({
        where: {
          AND: [valid, { type_of_committee: Committee_type_enum.executive }],
        },
      }),
    ]);
    return { members, director, committee };
  }
}
