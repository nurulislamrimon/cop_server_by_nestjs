import { Injectable } from '@nestjs/common';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommitteeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommitteeDto: CreateCommitteeDto) {
    const result = await this.prisma.committee.create({
      data: createCommitteeDto,
    });
    return result;
  }

  async findAll(query: Prisma.CommitteeFindManyArgs) {
    const data = await this.prisma.committee.findMany(query);
    const total = await this.prisma.committee.count({ where: query.where });
    return { total, data };
  }

  async findUnique(query: Prisma.CommitteeFindUniqueArgs) {
    const result = await this.prisma.committee.findUnique(query);
    return result;
  }

  async findOne(query: Prisma.CommitteeFindFirstArgs) {
    const result = await this.prisma.committee.findFirst(query);
    return result;
  }

  async updateById(id: number, updateCommitteeDto: UpdateCommitteeDto) {
    const result = await this.prisma.committee.update({
      where: { id },
      data: updateCommitteeDto,
    });
    return result;
  }

  async update(data: Prisma.CommitteeUpdateArgs) {
    const result = await this.prisma.committee.update(data);
    return result;
  }

  async remove(query: Prisma.CommitteeDeleteArgs) {
    const result = await this.prisma.committee.delete(query);
    return result;
  }
}
