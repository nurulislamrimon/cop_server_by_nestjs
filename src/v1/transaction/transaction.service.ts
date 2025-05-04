/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * API: Service
   * Message: Create - transaction
   */
  async create(createTransactionDto: CreateTransactionDto) {
    const result = await this.prisma.$transaction(async (trx) => {
      const trxRow = await trx.transaction.create({
        data: createTransactionDto,
      });
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
      const next = await tx.transaction.update({
        where: { id },
        data: updateTransactionDto,
      });
      return next;
    });
  }
  /**
   * API: Service
   * Message: Delete - transaction
   */
  async remove(query: Prisma.TransactionDeleteArgs) {
    return await this.prisma.transaction.delete(query);
  }

  /**
   * API: Service
   * Message: Get transaction snapshot - transaction
   */
  async findAllSnapshot(query: Prisma.TransactionFindManyArgs) {
    // Grouped by filtered query (for table display)
    const grouped = await this.prisma.transaction.groupBy({
      by: ['member_id', 'trx_type'],
      where: query.where,
      _sum: { amount: true },
    });

    // Grouped for all-time grand total (no filtering)
    const grandGroup = await this.prisma.transaction.groupBy({
      by: ['trx_type'],
      _sum: { amount: true },
    });

    // Fetch involved members from filtered data
    const memberIds = [...new Set(grouped.map((g) => g.member_id))];
    const members = await this.prisma.member.findMany({
      where: { id: { in: memberIds } },
      select: { id: true, full_name: true },
    });

    const memberMap = new Map(members.map((m) => [m.id, m.full_name]));

    const memberSnapshotMap = new Map<number, any>();

    for (const row of grouped) {
      const { member_id, trx_type, _sum } = row;
      const amount = _sum.amount ?? 0;

      if (!memberSnapshotMap.has(member_id)) {
        memberSnapshotMap.set(member_id, {
          member_id,
          full_name: memberMap.get(member_id) || 'Unknown',
          total_deposit_amount: 0,
          total_withdraw_amount: 0,
          total_profit_amount: 0,
          total_loss_amount: 0,
          total_expense_amount: 0,
          total_investment_amount: 0,
          balance: 0,
        });
      }

      const member = memberSnapshotMap.get(member_id)!;

      switch (trx_type) {
        case 'Deposit':
          member.total_deposit_amount += amount;
          break;
        case 'Withdraw':
          member.total_withdraw_amount += amount;
          break;
        case 'Profit':
          member.total_profit_amount += amount;
          break;
        case 'Loss':
          member.total_loss_amount += amount;
          break;
        case 'Expense':
          member.total_expense_amount += amount;
          break;
      }
    }

    const data = Array.from(memberSnapshotMap.values()).map((member) => {
      member.balance =
        member.total_deposit_amount +
        member.total_profit_amount -
        member.total_withdraw_amount -
        member.total_expense_amount -
        member.total_loss_amount -
        member.total_investment_amount;

      return member;
    }).sort((a, b) => b.balance - a.balance);

    // Calculate grandTotal from all-time data
    const grandTotal = {
      total_deposit_amount: 0,
      total_withdraw_amount: 0,
      total_profit_amount: 0,
      total_loss_amount: 0,
      total_expense_amount: 0,
      total_investment_amount: 0,
      total_balance: 0,
    };

    for (const row of grandGroup) {
      const amount = row._sum.amount ?? 0;
      switch (row.trx_type) {
        case 'Deposit':
          grandTotal.total_deposit_amount += amount;
          break;
        case 'Withdraw':
          grandTotal.total_withdraw_amount += amount;
          break;
        case 'Profit':
          grandTotal.total_profit_amount += amount;
          break;
        case 'Loss':
          grandTotal.total_loss_amount += amount;
          break;
        case 'Expense':
          grandTotal.total_expense_amount += amount;
          break;
      }
    }

    grandTotal.total_balance =
      grandTotal.total_deposit_amount +
      grandTotal.total_profit_amount -
      grandTotal.total_withdraw_amount -
      grandTotal.total_expense_amount -
      grandTotal.total_loss_amount -
      grandTotal.total_investment_amount;

    return {
      data,
      grandTotal,
    };
  }


  /**
   * API: Service
   * Message: Get a transaction snapshot - transaction
   */
  async findAMemberSnapshot(
    memberId: number,
    where?: Prisma.TransactionWhereInput,
  ) {
    // Merge memberId into the where clause
    const effectiveWhere: Prisma.TransactionWhereInput = {
      ...where,
      member_id: memberId,
    };

    // Group transactions for this member by type
    const grouped = await this.prisma.transaction.groupBy({
      by: ['trx_type'],
      where: effectiveWhere,
      _sum: {
        amount: true,
      },
    });

    // Fetch member name
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, full_name: true },
    });

    if (!member) {
      throw new Error(`Member with ID ${memberId} not found.`);
    }

    // Initialize snapshot
    const snapshot = {
      member_id: member.id,
      full_name: member.full_name,
      total_deposit_amount: 0,
      total_withdraw_amount: 0,
      total_profit_amount: 0,
      total_loss_amount: 0,
      total_expense_amount: 0,
      total_investment_amount: 0,
      balance: 0,
    };

    for (const row of grouped) {
      const trx_type = row.trx_type;
      const amount = row._sum.amount ?? 0;

      switch (trx_type) {
        case 'Deposit':
          snapshot.total_deposit_amount += amount;
          break;
        case 'Withdraw':
          snapshot.total_withdraw_amount += amount;
          break;
        case 'Profit':
          snapshot.total_profit_amount += amount;
          break;
        case 'Loss':
          snapshot.total_loss_amount += amount;
          break;
        case 'Expense':
          snapshot.total_expense_amount += amount;
          break;
      }
    }

    // Calculate balance
    snapshot.balance =
      snapshot.total_deposit_amount +
      snapshot.total_profit_amount -
      snapshot.total_withdraw_amount -
      snapshot.total_expense_amount -
      snapshot.total_loss_amount -
      snapshot.total_investment_amount;

    return snapshot;
  }
}
