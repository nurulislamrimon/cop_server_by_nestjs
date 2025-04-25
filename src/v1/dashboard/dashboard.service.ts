import { Injectable } from '@nestjs/common';
import { Committee_type_enum } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { subYears, startOfYear, endOfYear, startOfMonth, endOfMonth, subMonths } from 'date-fns';


@Injectable()
export class DashboardService {

  constructor(private readonly prisma: PrismaService) { }

  /**
   * API: Service
   * Message: Get - statistics from snapshot and member
   */
  async getTotalModelsCounted() {
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


  /**
    * API: Service
    * Message: Get - last month statistics with differences and member
    */
  async lastMonthStatistics(member_id: number) {
    const now = new Date();

    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);
    const previousStart = startOfMonth(subMonths(now, 1));
    const previousEnd = endOfMonth(subMonths(now, 1));

    const getMonthlyStats = async (start: Date, end: Date) => {
      return this.prisma.transaction.groupBy({
        by: ['trx_type'],
        _sum: {
          amount: true,
        },
        where: {
          member_id,
          collected_at: {
            gte: start,
            lte: end,
          },
          deleted_at: null,
        },
      });
    };

    const [currentStats, previousStats] = await Promise.all([
      getMonthlyStats(currentStart, currentEnd),
      getMonthlyStats(previousStart, previousEnd),
    ]);

    const toMap = (stats: any[]) =>
      stats.reduce((acc, cur) => {
        acc[cur.trx_type] = cur._sum.amount ?? 0;
        return acc;
      }, {} as Record<string, number>);

    const currentMap = toMap(currentStats);
    const previousMap = toMap(previousStats);

    const allTypes = new Set([
      ...Object.keys(currentMap),
      ...Object.keys(previousMap),
    ]);

    const differenceMap: Record<string, number> = {};
    allTypes.forEach((type) => {
      differenceMap[type] = (currentMap[type] ?? 0) - (previousMap[type] ?? 0);
    });

    return {
      currentMonth: currentMap,
      previousMonth: previousMap,
      difference: differenceMap,
    };
  }

  /**
 * API: Service
 * Message: Get - last year statistics with differences and member
 */
  async lastYearStatistics(member_id: number) {
    const now = new Date();

    const currentStart = startOfYear(now);
    const currentEnd = endOfYear(now);
    const previousStart = startOfYear(subYears(now, 1));
    const previousEnd = endOfYear(subYears(now, 1));

    const getYearlyStats = async (start: Date, end: Date) => {
      return this.prisma.transaction.groupBy({
        by: ['trx_type'],
        _sum: {
          amount: true,
        },
        where: {
          member_id, // ✅ filter by member_id
          collected_at: {
            gte: start,
            lte: end,
          },
          deleted_at: null,
        },
      });
    };

    const [currentStats, previousStats] = await Promise.all([
      getYearlyStats(currentStart, currentEnd),
      getYearlyStats(previousStart, previousEnd),
    ]);

    const toMap = (stats: any[]) =>
      stats.reduce((acc, cur) => {
        acc[cur.trx_type] = cur._sum.amount ?? 0;
        return acc;
      }, {} as Record<string, number>);

    const currentMap = toMap(currentStats);
    const previousMap = toMap(previousStats);

    const allTypes = new Set([
      ...Object.keys(currentMap),
      ...Object.keys(previousMap),
    ]);

    const differenceMap: Record<string, number> = {};
    allTypes.forEach((type) => {
      differenceMap[type] = (currentMap[type] ?? 0) - (previousMap[type] ?? 0);
    });

    return {
      currentYear: currentMap,
      previousYear: previousMap,
      difference: differenceMap,
    };
  }

}
