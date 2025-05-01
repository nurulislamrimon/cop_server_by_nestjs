import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  Req,
  ParseIntPipe,
  ConflictException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { LoginMemberDto } from './dto/login-member.dto';
import { Request } from 'express';
import {
  memberFilterableFields,
  memberSearchableFields,
  memberSelectedFields,
} from './member.constants';
import { MemberService } from './member.service';
import { Public } from '../../decorators/public.decorator';
import {
  ClientInfo,
  IClientInfo,
} from '../../decorators/param/ClientInfo.decorator';
import { MemberSessionService } from '../member-session/member-session.service';
import { CloudflareService } from '../../lib/cloudflare/cloudflare.service';
import { SearchFilterAndPaginationInterceptor } from '../../interceptors/searchFilterAndPagination.interceptor';
import { formatPagination } from '../../utils/format.utils';
import { MailService } from '../../lib/mail/mail.service';
import { Member, Member_access_rule } from '@prisma/client';
import { AllowIf } from 'src/decorators/AllowIf.decorator';
import { omit } from '../../utils/omit.utils';

@Controller('v1/member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly memberSessionService: MemberSessionService,
    private readonly cloudflareService: CloudflareService,
    private readonly mailService: MailService,
  ) {}

  /**
   * API: Controller
   * Message: Create - member
   */
  @Get('mail/:email')
  @AllowIf('member:read')
  async testMail(@Param('email') email: string) {
    const result = await this.mailService.send({
      to: email,
      subject: 'Frist in the bdcommerce member!',
      html: '<p>BD commerce application mail service running well!</p>',
    });
    return {
      message: 'Mail send service',
      data: result,
    };
  }

  /**
   * API: Controller
   * Message: Create - member
   */
  @Post('add')
  @AllowIf('member:write')
  async create(@Body() createMemberDto: CreateMemberDto) {
    const isExist = await this.memberService.findUnique({
      where: { email: createMemberDto.email },
    });
    if (isExist) {
      throw new ConflictException('Member already exist');
    }
    createMemberDto.id = Number(createMemberDto.id);
    const data = await this.memberService.create(createMemberDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = data;
    return {
      message: 'Member created successfully',
      data: { ...rest },
    };
  }

  /**
   * API: Controller
   * Message: Login - member
   */
  @Post('login')
  @Public()
  async login(
    @Body() loginMemberDto: LoginMemberDto,
    @ClientInfo() clientInfo: IClientInfo,
  ) {
    const isExist = (await this.memberService.findUnique({
      where: { email: loginMemberDto.email, is_active: true },
      include: {
        access_rule: {
          select: {
            rules: true,
          },
        },
      },
    })) as Member & { access_rule: Member_access_rule };

    if (!isExist) {
      throw new NotFoundException('Member not found');
    }

    const isPasswordMatched = await this.memberService.isPasswordMatched({
      inputPassword: loginMemberDto.password,
      currentPassword: isExist.password,
    });

    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid credentials!');
    }

    const accessToken = this.memberService.createToken({
      id: isExist.id,
      email: isExist.email,
      role: isExist.role,
      rules: isExist.access_rule?.rules,
    });

    const memberSessionData = {
      member_id: isExist.id,
      ...clientInfo,
    };

    const memberSession =
      await this.memberSessionService.create(memberSessionData);

    if (!memberSession) {
      throw new BadRequestException('Failed to create session');
    }
    let profile_photo_url: string | undefined;
    if (isExist.profile_photo) {
      profile_photo_url = await this.cloudflareService.getDownloadUrl(
        isExist.profile_photo,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = isExist;
    return {
      message: 'Member created successfully',
      data: {
        user: { ...rest, profile_photo_url },
        accessToken,
      },
    };
  }

  /**
   * API: Controller
   * Message: Get All - member
   */
  @Get('by-admin')
  @AllowIf('member:read')
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Member'>(
      memberSearchableFields,
      memberFilterableFields,
    ),
  )
  async findAllByAdmin(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as Record<string, string | number>;
    const data = await this.memberService.findAll({
      where,
      select: memberSelectedFields,
      ...formatPagination(pagination),
    });

    return {
      message: 'Member retrived successfully',
      meta: {
        total: data.total,
        limit: Number(pagination.limit),
        page: Number(pagination.page),
      },
      data: data.members,
    };
  }

  /**
   * API: Controller
   * Message: Get last member id - member
   */
  @Get('last-member-id')
  @AllowIf('member:read')
  async findLastMemberId(@Req() req: Request) {
    const lastMember = await this.memberService.findOne({
      orderBy: { id: 'desc' },
      select: {
        id: true,
      },
    });

    return {
      message: 'Member retrieved successfully',
      data: lastMember,
    };
  }

  /**
   * API: Controller
   * Message: Get All - member
   */
  @Get()
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Member'>(
      memberSearchableFields,
      memberFilterableFields,
    ),
  )
  @Public()
  async findAll(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as Record<string, string | number>;
    const { AND, ...rest } = where;
    const finalWhere = {
      AND: [...(AND || []), { is_active: true }],
      ...(rest || {}),
    };

    const data = await this.memberService.findAll({
      where: finalWhere,
      select: omit(memberSelectedFields, [
        'address',
        'father_name',
        'mother_name',
        'account_status',
        'profile_photo',
        'reffered_by',
      ]),
      ...formatPagination(pagination),
    });

    return {
      message: 'Member retrived successfully',
      meta: {
        total: data.total,
        limit: Number(pagination.limit),
        page: Number(pagination.page),
      },
      data: data.members,
    };
  }

  /**
   * API: Controller
   * Message: Get Me - member
   */
  @Get('me')
  async findMe(@Req() req: Request) {
    const user = req['user'] as Record<string, any>;
    const id = user?.id;
    const isExist = await this.memberService.findUniqueWithPhotoAndTrxSnapshot({
      where: { id: +id },
      select: {
        ...memberSelectedFields,
        access_rule: { select: { rules: true } },
      },
    });
    return { data: isExist };
  }

  /**
   * API: Controller
   * Message: Get One - member
   */
  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.memberService.findUniqueWithPhoto({
      where: { id: +id },
      select: {
        ...memberSelectedFields,
      },
    });
    return { data: isExist };
  }

  /**
   * API: Controller
   * Message: Update Me - member
   */
  @Patch('update')
  async updateMe(
    @Body() updateMemberDto: UpdateMemberDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as Record<string, any>;
    const id = user?.id;
    if (updateMemberDto.role) {
      throw new BadRequestException('You can not change your role');
    }
    const result = await this.memberService.update(+id, updateMemberDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = result;
    return { data: rest };
  }

  /**
   * API: Controller
   * Message: Update - member
   */
  @Patch(':id')
  @AllowIf('member:update')
  async updateById(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const isExist = await this.memberService.findUnique({
      where: { id: +id },
    });

    if (!isExist) {
      throw new NotFoundException('Member not found');
    }
    const result = await this.memberService.update(+id, updateMemberDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = result;
    return { data: rest };
  }

  /**
   * API: Controller
   * Message: Delete - member
   */
  @Delete(':id')
  @AllowIf('member:delete')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const data = await this.memberService.remove(+id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = data;
    return { data: rest };
  }
}
