import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PROGRAM_CATEGORY } from '../../../common/constants/enums';
import type { ProgramCategory } from '../../../common/constants/enums';

export class QueryLanguageProgramsDto {
  @ApiPropertyOptional({ enum: PROGRAM_CATEGORY })
  @IsOptional()
  @IsEnum(PROGRAM_CATEGORY)
  category?: ProgramCategory;
}
