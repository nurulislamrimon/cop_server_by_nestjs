import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as bcrypt from 'bcryptjs';
import { envConfig } from '../../config/env.config';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PasswordDto } from './dto/login-member.dto';
import * as jwt from 'jsonwebtoken';
import { CloudflareService } from '../../lib/cloudflare/cloudflare.service';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { saltRounds } from '../../constants/common.constants';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
    private readonly cloudflareService: CloudflareService,
  ) { }

  /**
   * API: Service
   * Message: Create - member
   */
  async create(createMemberDto: CreateMemberDto) {
    // hash the password
    createMemberDto.password = await bcrypt.hash(
      createMemberDto.password,
      saltRounds,
    );
    // create presignedurl to upload profile photo
    let uploadUrl: string | undefined;
    if (createMemberDto.profile_photo) {
      const result = await this.cloudflareService.getUploadUrl(
        createMemberDto.profile_photo,
      );
      createMemberDto.profile_photo = result.fileName;
      uploadUrl = result.uploadUrl;
    }
    const data = await this.prisma.member.create({
      data: createMemberDto,
    });
    return { ...data, uploadUrl };
  }

  /**
   * API: Service
   * Message: Password matcher - member
   */
  async isPasswordMatched(passwordDto: PasswordDto) {
    return await bcrypt.compare(
      passwordDto.inputPassword,
      passwordDto.currentPassword,
    );
  }
  /**
   * API: Service
   * Message: Token generator - member
   */
  createToken(
    payload: Record<string, unknown>,
    secret?: string,
    expiresIn?: number,
  ) {
    const token = jwt.sign(
      payload as jwt.JwtPayload,
      secret || envConfig.access_token_secret,
      { expiresIn: expiresIn || envConfig.access_token_expires_in },
    );
    return token;
  }

  /**
   * API: Service
   * Message: Get All - member
   */
  async findAll(query: Prisma.MemberFindManyArgs<DefaultArgs>) {
    const result = await this.prisma.member.findMany(query);
    // add presigned url for profile photos
    const members = await Promise.all(
      result.map(async (ad) => {
        if (ad.profile_photo) {
          const url = await this.cloudflareService.getDownloadUrl(
            ad.profile_photo,
          );
          return { ...ad, profile_photo_url: url };
        }
        return ad;
      }),
    );
    const total = await this.prisma.member.count({ where: query.where });
    return {
      total,
      members,
    };
  }

  /**
   * API: Service
   * Message: Get One - member
   */
  findOne(query: Prisma.MemberFindFirstOrThrowArgs) {
    return this.prisma.member.findFirst(query);
  }
  /**
   * API: Service
   * Message: Get Unique - member
   */
  findUnique(query: Prisma.MemberFindUniqueArgs) {
    return this.prisma.member.findUnique(query);
  }

  /**
   * API: Service
   * Message: Get Unique - member
   */
  async findUniqueWithPhoto(query: Prisma.MemberFindUniqueArgs) {
    const isExist = await this.prisma.member.findUnique(query);
    if (!isExist) {
      throw new NotFoundException('Member not found!');
    }

    let profile_photo_url: string | undefined;
    if (isExist.profile_photo) {
      profile_photo_url = await this.cloudflareService.getDownloadUrl(
        isExist.profile_photo,
      );
    }
    return { ...isExist, profile_photo_url };
  }

  /**
   * API: Service
   * Message: Get Unique - member
   */
  async findUniqueWithPhotoAndTrxSnapshot(query: Prisma.MemberFindUniqueArgs) {
    const isExist = await this.prisma.member.findUnique(query);
    if (!isExist) {
      throw new NotFoundException('Member not found!');
    }

    let profile_photo_url: string | undefined;
    if (isExist.profile_photo) {
      profile_photo_url = await this.cloudflareService.getDownloadUrl(
        isExist.profile_photo,
      );
    }
    const transaction_snapshot = await this.transactionService.findAMemberSnapshot(isExist.id)
    return { ...isExist, profile_photo_url, transaction_snapshot };
  }

  /**
   * API: Service
   * Message: Update - member
   */
  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const isExist = await this.findUnique({ where: { id } });
    if (!isExist) {
      throw new NotFoundException('Member not found!');
    }
    if (updateMemberDto.password) {
      updateMemberDto.password = await bcrypt.hash(
        updateMemberDto.password,
        saltRounds,
      );
    }

    if (updateMemberDto.email && updateMemberDto.email !== isExist.email) {
      const isAlreadyExist = await this.findOne({
        where: { email: updateMemberDto.email },
      });
      if (isAlreadyExist) {
        throw new BadRequestException('Email already exists');
      }
    }

    let uploadUrl: string | undefined;
    if (updateMemberDto.profile_photo) {
      const result = await this.cloudflareService.getUploadUrl(
        updateMemberDto.profile_photo,
      );
      updateMemberDto.profile_photo = result.fileName;
      uploadUrl = result.uploadUrl;
      if (isExist.profile_photo) {
        await this.cloudflareService.deleteFile(isExist.profile_photo);
      }
    }

    const data = await this.prisma.member.update({
      where: { id },
      data: updateMemberDto,
    });
    return { ...data, uploadUrl };
  }

  /**
   * API: Service
   * Message: Delete - member
   */
  async remove(id: number) {
    return await this.prisma.$transaction(async (trx) => {
      const isExist = await trx.member.findUnique({ where: { id } });
      if (!isExist) {
        throw new NotFoundException('Member not found!');
      }
      if (isExist.profile_photo) {
        await this.cloudflareService.deleteFile(isExist.profile_photo);
      }
      return this.prisma.member.delete({ where: { id } });
    });
  }
}
