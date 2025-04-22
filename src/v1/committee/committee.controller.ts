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

@Controller('v1/committee')
export class CommitteeController {
  constructor(private readonly committeeService: CommitteeService) {}

  @Post()
  create(@Body() createCommitteeDto: CreateCommitteeDto) {
    return this.committeeService.create(createCommitteeDto);
  }

  @Get()
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Committee'>(
      committeeSearchableFields,
      committeeFilterableFields,
    ),
  )
  async findAll(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as JwtPayload;

    const result = await this.committeeService.findAll({
      where,
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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.committeeService.findOne({ where: { id: +id } });
    if (!isExist) {
      throw new NotFoundException('Committee not found with id #' + id);
    }
    return isExist;
  }

  @Patch(':id')
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.committeeService.findOne({ where: { id: +id } });
    if (!isExist) {
      throw new NotFoundException('Committee not found with id #' + id);
    }
    return await this.committeeService.remove({ where: { id: +id } });
  }
}
