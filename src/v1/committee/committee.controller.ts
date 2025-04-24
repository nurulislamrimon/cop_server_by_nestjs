import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { CreateCommitteeDto } from './dto/create-committee.dto';
import { UpdateCommitteeDto } from './dto/update-committee.dto';
import { SearchFilterAndPaginationInterceptor } from 'src/interceptors/searchFilterAndPagination.interceptor';
import {
  committeeFilterableFields,
  committeeSearchableFields,
} from './committee.constants';
import { formatPagination } from 'src/utils/format.utils';
import { JwtPayload } from 'jsonwebtoken';
import { Public } from 'src/decorators/public.decorator';
import { AllowIf } from 'src/decorators/AllowIf.decorator';

@Controller('v1/committee')
export class CommitteeController {
  constructor(private readonly committeeService: CommitteeService) { }

  /**
   * API: Controller
   * Message: Create - committee
   */
  @Post('add')
  @AllowIf('committee:write')
  create(@Body() createCommitteeDto: CreateCommitteeDto) {
    return this.committeeService.create(createCommitteeDto);
  }

  /**
   * API: Controller
   * Message: Get All - committee
   */
  @Get()
  @Public()
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Committee'>(
      committeeSearchableFields,
      committeeFilterableFields,
    ),
  )
  async findAll(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as JwtPayload;
    const { AND, ...rest } = where;

    const finalWhere = {
      AND: [
        ...(AND || []),
        { OR: [{ valid_till: { gt: new Date() } }, { valid_till: null }] },
        ...(rest || {})
      ],
    };

    const result = await this.committeeService.findAll({
      where: finalWhere,
      include: {
        member: {
          select: {
            full_name: true,
          },
        },
      },
      ...formatPagination(pagination),
    });
    return {
      data: result.data,
      meta: {
        total: result.total,
        page: Number(pagination.page),
        limit: Number(pagination.limit),
      },
    };
  }

  /**
   * API: Controller
   * Message: Get All - committee
   */
  @Get('by-admin')
  @AllowIf('committee:read')
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Committee'>(
      committeeSearchableFields,
      committeeFilterableFields,
    ),
  )
  async findAllByAdmin(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as JwtPayload;

    const result = await this.committeeService.findAll({
      where,
      include: {
        member: {
          select: {
            full_name: true,
          },
        },
      },
      ...formatPagination(pagination),
    });
    return {
      data: result.data,
      meta: {
        total: result.total,
        page: Number(pagination.page),
        limit: Number(pagination.limit),
      },
    };
  }

  /**
   * API: Controller
   * Message: Get One - committee
   */
  @Get(':id')
  @AllowIf('committee:read')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.committeeService.findOne({ where: { id: +id } });
    if (!isExist) {
      throw new NotFoundException('Committee not found with id #' + id);
    }
    return isExist;
  }

  /**
   * API: Controller
   * Message: Update - committee
   */
  @Patch(':id')
  @AllowIf('committee:update')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateCommitteeDto: UpdateCommitteeDto,
  ) {
    const isExist = await this.committeeService.findOne({ where: { id: +id } });
    if (!isExist) {
      throw new NotFoundException('Committee not found with id #' + id);
    }
    return await this.committeeService.updateById(+id, updateCommitteeDto);
  }

  /**
   * API: Controller
   * Message: Delete - committee
   */
  @Delete(':id')
  @AllowIf('committee:delete')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.committeeService.findOne({ where: { id: +id } });
    if (!isExist) {
      throw new NotFoundException('Committee not found with id #' + id);
    }
    return await this.committeeService.remove({ where: { id: +id } });
  }
}
