import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * API: Service
   * Message: Create - transaction
   */
  async create(createTransactionDto: CreateTransactionDto) {
    const result = await this.prisma.transaction.create({
      data: createTransactionDto,
    });
    return result;
  }

  /**
   * API: Service
   * Message: Get All - transaction
   */
  async findAll(query: Prisma.TransactionFindManyArgs) {
    const data = await this.prisma.transaction.findMany(query);
    const total = await this.prisma.transaction.count({ where: query.where });
    return {
      data,
      total,
    };
  }

  /**
   * API: Service
   * Message: Get One - transaction
   */
  async findOne(query: Prisma.TransactionFindFirstArgs) {
    const result = await this.prisma.transaction.findFirst(query);
    return result;
  }

  /**
   * API: Service
   * Message: Get Unique - transaction
   */
  async findUnique(query: Prisma.TransactionFindUniqueArgs) {
    const result = await this.prisma.transaction.findUnique(query);
    return result;
  }

  /**
   * API: Service
   * Message: Update - transaction
   */
  async updateById(id: number, updateTransactionDto: UpdateTransactionDto) {
    const result = await this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
    return result;
  }

  /**
   * API: Service
   * Message: Update - transaction
   */
  async update(data: Prisma.TransactionUpdateArgs) {
    const result = await this.prisma.transaction.update(data);
    return result;
  }

  /**
   * API: Service
   * Message: Delete - transaction
   */
  async remove(query: Prisma.TransactionDeleteArgs) {
    const result = await this.prisma.transaction.delete(query);
    return result;
  }
}
