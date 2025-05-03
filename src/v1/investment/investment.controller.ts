import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { SearchFilterAndPaginationInterceptor } from 'src/interceptors/searchFilterAndPagination.interceptor';
import {
  investmentFilterableFields,
  investmentSearchableFields,
} from './investment.constants';
import { formatPagination } from 'src/utils/format.utils';
import { AllowIf } from 'src/decorators/AllowIf.decorator';

@Controller('v1/investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) { }

  /**
   * API: Controller
   * Message: Create - investment
   */
  @Post('add')
  @AllowIf('investment:write')
  create(
    @Body() createInvestmentDto: CreateInvestmentDto,
  ) {
    return this.investmentService.create(createInvestmentDto);
  }

  /**
   * API: Controller
   * Message: Get All - investment
   */
  @Get('by-admin')
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Investment'>(
      investmentSearchableFields,
      investmentFilterableFields,
    ),
  )
  @AllowIf('investment:read')
  async findAllByAdmin(@Req() req: Request) {
    const where = req['where'];
    console.dir(where, { depth: null });
    const pagination = req['pagination'] as Record<string, unknown>;
    const result = await this.investmentService.findAll({
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


  /**
   * API: Controller
   * Message: Get All - investment
   */
  @Get()
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Investment'>(
      investmentSearchableFields,
      investmentFilterableFields,
    ),
  )
  async findAll(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as Record<string, unknown>;
    const user = req['user'] as JwtPayload;
    const { AND, ...rest } = where;
    const finalWhere = {
      AND: [...(AND || []), { member_id: user.id }],
      ...(rest || {}),
    };
    const result = await this.investmentService.findAll({
      where: finalWhere,
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
   * Message: Get One - investment
   */
  @Get(':id')
  @AllowIf('investment:read')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.investmentService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException('Investment not found with id #' + id);
    }
    return isExist;
  }

  /**
   * API: Controller
   * Message: Update - investment
   */
  @Patch(':id')
  @AllowIf('investment:update')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ) {
    const isExist = await this.investmentService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException('Investment not found with id #' + id);
    }
    return await this.investmentService.updateById(+id, updateInvestmentDto);
  }

  /**
   * API: Controller
   * Message: Delete - investment
   */
  @Delete(':id')
  @AllowIf('investment:delete')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.investmentService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException('Investment not found with id #' + id);
    }
    return await this.investmentService.remove({ where: { id: +id } });
  }
}
