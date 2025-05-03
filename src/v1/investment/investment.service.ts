/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvestmentService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * API: Service
   * Message: Create - investment
   */
  async create(createInvestmentDto: CreateInvestmentDto) {
    const result = await this.prisma.investment.create({
      data: createInvestmentDto,
    });
    return result;
  }

  /**
   * API: Service
   * Message: Get All - investment
   */
  async findAll(query: Prisma.InvestmentFindManyArgs) {
    const data = await this.prisma.investment.findMany(query);
    const total = await this.prisma.investment.count({ where: query.where });
    return {
      data,
      total,
    };
  }

  /**
   * API: Service
   * Message: Get One - investment
   */
  async findOne(query: Prisma.InvestmentFindFirstArgs) {
    const result = await this.prisma.investment.findFirst(query);
    return result;
  }

  /**
   * API: Service
   * Message: Get Unique - investment
   */
  async findUnique(query: Prisma.InvestmentFindUniqueArgs) {
    const result = await this.prisma.investment.findUnique(query);
    return result;
  }

  /**
   * API: Service
   * Message: Update - investment
   */
  async updateById(id: number, updateInvestmentDto: UpdateInvestmentDto) {
    const result = await this.prisma.investment.update({
      where: { id },
      data: updateInvestmentDto,
    });
    return result
  }
  /**
   * API: Service
   * Message: Delete - investment
   */
  async remove(query: Prisma.InvestmentDeleteArgs) {
    return await this.prisma.investment.delete(query);
  }
}
