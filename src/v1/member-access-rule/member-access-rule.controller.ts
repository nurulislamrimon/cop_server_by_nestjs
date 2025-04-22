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
import { MemberAccessRuleService } from './member-access-rule.service';
import { CreateMemberAccessRuleDto } from './dto/create-member-access-rule.dto';
import { UpdateMemberAccessRuleDto } from './dto/update-member-access-rule.dto';
import { SearchFilterAndPaginationInterceptor } from '../../interceptors/searchFilterAndPagination.interceptor';
import {
  member_access_ruleFilterableFields,
  member_access_ruleSearchableFields,
} from './member-access-rule.constants';
import { formatPagination } from '../../utils/format.utils';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AllowMemberOnlyIf } from '../../decorators/AllowMemberOnlyIf.decorator';

@Controller('v1/member-access-rule')
export class MemberAccessRuleController {
  constructor(private readonly accessRuleService: MemberAccessRuleService) {}

  /**
   * API: Controller
   * Message: Create - Access Rule
   */
  @Post()
  @AllowMemberOnlyIf('member_access_rule:write')
  async create(@Body() createAccessRuleDto: CreateMemberAccessRuleDto) {
    return await this.accessRuleService.create(createAccessRuleDto);
  }

  /**
   * API: Controller
   * Message: Get All - Access Rule
   */
  @Get()
  @AllowMemberOnlyIf('member_access_rule:read')
  @UseInterceptors(
    new SearchFilterAndPaginationInterceptor<'Member_access_rule'>(
      member_access_ruleSearchableFields,
      member_access_ruleFilterableFields,
    ),
  )
  async findAll(@Req() req: Request) {
    const where = req['where'];
    const pagination = req['pagination'] as Record<string, unknown>;

    const result = await this.accessRuleService.findAll({
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
   * Message: Get One - Access Rule
   */
  @Get('for-me')
  async ruleForMe(@Req() req: Request) {
    const user = req.user as JwtPayload;

    const isExist = await this.accessRuleService.findOne({
      where: { role: user.role },
    });
    if (!isExist) {
      throw new NotFoundException(`Access rule not found for you!`);
    }
    return isExist;
  }

  /**
   * API: Controller
   * Message: Get One - Access Rule
   */
  @Get(':id')
  @AllowMemberOnlyIf('member_access_rule:read')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.accessRuleService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException(`Access rule not found for id #${id}`);
    }
    return isExist;
  }

  /**
   * API: Controller
   * Message: Update - Access Rule
   */
  @Patch(':id')
  @AllowMemberOnlyIf('member_access_rule:update')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateAccessRuleDto: UpdateMemberAccessRuleDto,
  ) {
    const isExist = await this.accessRuleService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException(`Access rule not found for id #${id}`);
    }
    return await this.accessRuleService.updateById(+id, updateAccessRuleDto);
  }

  /**
   * API: Controller
   * Message: Delete - Access Rule
   */
  @Delete(':id')
  @AllowMemberOnlyIf('member_access_rule:delete')
  async remove(@Param('id', ParseIntPipe) id: string) {
    const isExist = await this.accessRuleService.findOne({
      where: { id: +id },
    });
    if (!isExist) {
      throw new NotFoundException(`Access rule not found for id #${id}`);
    }
    return this.accessRuleService.remove({ where: { id: +id } });
  }
}
