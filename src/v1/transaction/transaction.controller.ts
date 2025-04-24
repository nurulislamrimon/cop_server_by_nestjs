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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { SearchFilterAndPaginationInterceptor } from 'src/interceptors/searchFilterAndPagination.interceptor';
import {
  transactionFilterableFields,
  transactionSearchableFields,
} from './transaction.constants';
import { formatPagination } from 'src/utils/format.utils';
import { AllowIf } from 'src/decorators/AllowIf.decorator';

@Controller('v1/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  /**
   * API: Controller
   * Message: Create - transaction
   */
  @Post('add')
  @AllowIf('transaction:write')
  create(
    @Req() req: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const user = req.user as JwtPayload;
    createTransactionDto.created_by_id = user.id;
    return this.transactionService.create(createTransactionDto);
  }

  /**
   * API: Controller
   * Message: Get All - transaction
   */
  @Get('by-admin')
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Transaction'>(
      transactionSearchableFields,
      transactionFilterableFields,
    ),
  )
  @AllowIf('transaction:read')
  async findAllByAdmin(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as Record<string, unknown>;
    const result = await this.transactionService.findAll({
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
   * Message: Get All - transaction
   */
  @Get()
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Transaction'>(
      transactionSearchableFields,
      transactionFilterableFields,
    ),
  )
  async findAll(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as Record<string, unknown>;
    const user = req['user'] as JwtPayload;
    const { AND, ...rest } = where;
    const finalWhere = {
      AND: [...(AND || []), { member_id: user.id }],
      ...(rest || {})
    };
    const result = await this.transactionService.findAll({
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
   * Message: Get One - transaction
   */
  @Get(':id')
  @AllowIf('transaction:read')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.transactionService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException('Transaction not found with id #' + id);
    }
    return isExist;
  }

  /**
   * API: Controller
   * Message: Update - transaction
   */
  @Patch(':id')
  @AllowIf('transaction:update')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const isExist = await this.transactionService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException('Transaction not found with id #' + id);
    }
    return await this.transactionService.updateById(+id, updateTransactionDto);
  }

  /**
   * API: Controller
   * Message: Delete - transaction
   */
  @Delete(':id')
  @AllowIf('transaction:delete')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.transactionService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException('Transaction not found with id #' + id);
    }
    return await this.transactionService.remove({ where: { id: +id } });
  }
}
