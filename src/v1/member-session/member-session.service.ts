import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateMemberSessionDto } from './dto/create-member-session.dto';
import { PrismaService } from '../../lib/prisma/prisma.service';

@Injectable()
export class MemberSessionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * API: Service
   * Message: Create - member-session
   */
  async create(createMemberSessionDto: CreateMemberSessionDto) {
    const result = await this.prisma.member_session.create({
      data: createMemberSessionDto,
    });
    return result;
  }

  /**
   * API: Service
   * Message: Update - member-session
   */
  async update(data: Prisma.Member_sessionUpdateArgs) {
    const result = await this.prisma.member_session.update(data);
    return result;
  }

  /**
   * API: Service
   * Message: Get All - member-session
   */
  async findAll(query: Prisma.Member_sessionFindManyArgs) {
    const data = await this.prisma.member_session.findMany(query);
    const total = await this.prisma.member_session.count({
      where: query.where,
    });
    return {
      total,
      data,
    };
  }

  /**
   * API: Service
   * Message: Get One - member-session
   */
  async findOne(query: Prisma.Member_sessionFindFirstArgs) {
    const data = await this.prisma.member_session.findFirst(query);
    return data;
  }

  /**
   * API: Service
   * Message: Get Unique - member-session
   */
  async findUnique(query: Prisma.Member_sessionFindUniqueArgs) {
    const data = await this.prisma.member_session.findUnique(query);
    return data;
  }

  /**
   * API: Service
   * Message: Delete - member-session
   */
  async remove(query: Prisma.Member_sessionDeleteArgs) {
    const data = await this.prisma.member_session.delete(query);
    return data;
  }
}
