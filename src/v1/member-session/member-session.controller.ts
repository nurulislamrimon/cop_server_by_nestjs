import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Req,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { MemberSessionService } from './member-session.service';
import { SearchFilterAndPaginationInterceptor } from '../../interceptors/searchFilterAndPagination.interceptor';
import {
  memberSessionFilterableFields,
  memberSessionSearchableFields,
  memberSessionSelectedFields,
} from './member-session.constants';
import { formatPagination } from '../../utils/format.utils';
import { memberSelectedFields } from '../member/member.constants';
import { JwtPayload } from 'jsonwebtoken';
import { AllowIf } from 'src/decorators/AllowIf.decorator';

@Controller('v1/member-session')
export class MemberSessionController {
  constructor(private readonly memberSessionService: MemberSessionService) { }

  /**
   * API: Controller
   * Message: Get All - member-session
   */
  @Get()
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Member_session'>(
      memberSessionSearchableFields,
      memberSessionFilterableFields,
    ),
  )
  @AllowIf('member_session:read')
  async findAll(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as Record<string, string | number>;

    const result = await this.memberSessionService.findAll({
      where,
      // select: memberSessionSelectedFields,
      select: {
        ...memberSessionSelectedFields,
        member: { select: { email: true, id: true } },
      },
      ...formatPagination(pagination),
    });
    return {
      meta: {
        total: result.total,
        page: Number(pagination.page),
        limit: Number(pagination.limit),
      },
      data: result.data,
    };
  }

  /**
   * API: Controller
   * Message: Get All - member-session
   */
  @Get('my-history')
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Member_session'>(
      memberSessionSearchableFields,
      memberSessionFilterableFields,
    ),
  )
  async findMyLoginHistory(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as Record<string, string | number>;
    const user = req['user'] as JwtPayload;
    const { AND, ...rest } = where
    const finalWhere = {
      AND: [...(AND || []), { member_id: user.id }],
      ...rest
    };
    const result = await this.memberSessionService.findAll({
      where: finalWhere,
      select: {
        ...memberSessionSelectedFields,
        member: { select: { email: true, id: true } },
      },
      ...formatPagination(pagination),
    });
    return {
      meta: {
        total: result.total,
        page: Number(pagination.page),
        limit: Number(pagination.limit),
      },
      data: result.data,
    };
  }

  /**
   * API: Controller
   * Message: Get One - member-session
   */
  @Get(':id')
  @AllowIf('member_session:read')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const data = await this.memberSessionService.findUnique({
      where: { id: +id },
      include: {
        member: {
          select: {
            ...memberSelectedFields,
          },
        },
      },
    });
    if (!data) {
      throw new NotFoundException('Data not found');
    }
    return data;
  }
}
