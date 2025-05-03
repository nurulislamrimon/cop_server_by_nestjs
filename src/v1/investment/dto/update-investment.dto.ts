import { PartialType } from '@nestjs/mapped-types';
import { CreateAdditionalInvestmentDto, CreateInvestmentDto } from './create-investment.dto';

export class UpdateInvestmentDto extends PartialType(CreateInvestmentDto) { }

export class UpdateAdditionalInvestmentDto extends PartialType(CreateAdditionalInvestmentDto) { }
