import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { Prisma, PrismaClient, Transaction_type_enum } from '@prisma/client';
import { trxFieldsMap } from './transaction.constants';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * API: Service
   * Message: Create - transaction
   */
  async create(createTransactionDto: CreateTransactionDto) {
    const result = await this.prisma.$transaction(async (trx) => {
      const trxRow = await trx.transaction.create({
        data: createTransactionDto,
      });
      await this.adjustSnapshot(
        trx,
        trxRow.member_id,
        trxRow.trx_type,
        trxRow.amount,
        +1,
      );
      return trxRow;
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
    return this.prisma.$transaction(async (tx) => {
      const prev = await tx.transaction.findUniqueOrThrow({ where: { id } });
      const next = await tx.transaction.update({
        where: { id },
        data: updateTransactionDto,
      });

      if (
        prev.trx_type !== next.trx_type ||
        prev.amount !== next.amount ||
        prev.member_id !== next.member_id
      ) {
        await this.adjustSnapshot(
          tx,
          prev.member_id,
          prev.trx_type,
          prev.amount,
          -1,
        );

        await this.adjustSnapshot(
          tx,
          next.member_id,
          next.trx_type,
          next.amount,
          +1,
        );
      }

      return next;
    });
  }
  /**
   * API: Service
   * Message: Delete - transaction
   */
  async remove(query: Prisma.TransactionDeleteArgs) {
    return this.prisma.$transaction(async (trx) => {
      const row = await trx.transaction.delete(query);

      await this.adjustSnapshot(
        trx,
        row.member_id,
        row.trx_type,
        row.amount,
        -1,
      );

      return row;
    });
  }

  /**
   * API: Service
   * Message: Update - snapshot and member
   */
  async adjustSnapshot(
    trx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    member_id: number,
    trx_type: Transaction_type_enum,
    amount: number,
    delta: 1 | -1 = +1,
  ) {
    const { count, amt, sign } = trxFieldsMap[trx_type];

    await trx.transaction_snapshot.upsert({
      where: { member_id: member_id },
      create: {
        member_id: member_id,
        [count]: delta,
        [amt]: delta * amount,
      },
      update: {
        [count]: { increment: delta },
        [amt]: { increment: delta * amount },
      },
    });

    await trx.member.update({
      where: { id: member_id },
      data: { balance: { increment: delta * sign * amount } },
    });
  }
}
