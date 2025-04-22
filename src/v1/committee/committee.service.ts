import { Injectable } from '@nestjs/common';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommitteeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * API: Service
   * Message: Create - committee
   */
  async create(createCommitteeDto: CreateCommitteeDto) {
    const result = await this.prisma.committee.create({
      data: createCommitteeDto,
    });
    return result;
  }

  /**
   * API: Service
   * Message: Get All - committee
   */
  async findAll(query: Prisma.CommitteeFindManyArgs) {
    const data = await this.prisma.committee.findMany(query);
    const total = await this.prisma.committee.count({ where: query.where });
    return { total, data };
  }

  /**
   * API: Service
   * Message: Get unique - committee
   */
  async findUnique(query: Prisma.CommitteeFindUniqueArgs) {
    const result = await this.prisma.committee.findUnique(query);
    return result;
  }

  /**
   * API: Service
   * Message: Get One - committee
   */
  async findOne(query: Prisma.CommitteeFindFirstArgs) {
    const result = await this.prisma.committee.findFirst(query);
    return result;
  }

  /**
   * API: Service
   * Message: Update - committee
   */
  async updateById(id: number, updateCommitteeDto: UpdateCommitteeDto) {
    const result = await this.prisma.committee.update({
      where: { id },
      data: updateCommitteeDto,
    });
    return result;
  }

  /**
   * API: Service
   * Message: Update - committee
   */
  async update(data: Prisma.CommitteeUpdateArgs) {
    const result = await this.prisma.committee.update(data);
    return result;
  }

  /**
   * API: Service
   * Message: Delete - committee
   */
  async remove(query: Prisma.CommitteeDeleteArgs) {
    const result = await this.prisma.committee.delete(query);
    return result;
  }
}
