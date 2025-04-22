import { Injectable } from '@nestjs/common';
import { CreateMemberAccessRuleDto } from './dto/create-member-access-rule.dto';
import { UpdateMemberAccessRuleDto } from './dto/update-member-access-rule.dto';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MemberAccessRuleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * API: Service
   * Message: Create - Access Rule
   */
  async create(createAccessRuleDto: CreateMemberAccessRuleDto) {
    const result = await this.prisma.member_access_rule.create({
      data: createAccessRuleDto,
    });
    return result;
  }

  /**
   * API: Service
   * Message: Get All - Access Rule
   */
  async findAll(query: Prisma.Member_access_ruleFindManyArgs) {
    const data = await this.prisma.member_access_rule.findMany(query);
    const total = await this.prisma.member_access_rule.count({
      where: query.where,
    });
    return { data, total };
  }

  /**
   * API: Service
   * Message: Get One - Access Rule
   */
  async findOne(query: Prisma.Member_access_ruleFindFirstArgs) {
    const result = await this.prisma.member_access_rule.findFirst(query);
    return result;
  }

  /**
   * API: Service
   * Message: Get Unique - Access Rule
   */
  async findUnique(query: Prisma.Member_access_ruleFindUniqueArgs) {
    const result = await this.prisma.member_access_rule.findUnique(query);
    return result;
  }

  /**
   * API: Service
   * Message: Update - Access Rule
   */
  async updateById(id: number, updateAccessRuleDto: UpdateMemberAccessRuleDto) {
    const result = await this.prisma.member_access_rule.update({
      where: { id },
      data: updateAccessRuleDto,
    });
    return result;
  }

  /**
   * API: Service
   * Message: Update - Access Rule
   */
  async update(data: Prisma.Member_access_ruleUpdateArgs) {
    const result = await this.prisma.member_access_rule.update(data);
    return result;
  }

  /**
   * API: Service
   * Message: Delete - Access Rule
   */
  async remove(query: Prisma.Member_access_ruleDeleteArgs) {
    const result = await this.prisma.member_access_rule.delete(query);
    return result;
  }
}
