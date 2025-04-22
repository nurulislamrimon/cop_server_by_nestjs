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

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const user = req.user as JwtPayload;
    createTransactionDto.created_by_id = user.id;
    return this.transactionService.create(createTransactionDto);
  }

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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.transactionService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException('Transaction not found with id #' + id);
    }
    return isExist;
  }

  @Patch(':id')
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

  @Delete(':id')
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
