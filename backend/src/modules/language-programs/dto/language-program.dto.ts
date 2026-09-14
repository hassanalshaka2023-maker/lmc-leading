import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { PROGRAM_CATEGORY } from '../../../common/constants/enums';
import type { ProgramCategory } from '../../../common/constants/enums';
import {
  LocalizedStringDto,
  PartialLocalizedStringDto,
} from '../../../common/dto/localized-string.dto';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateLanguageProgramDto {
  @ApiProperty({ type: LocalizedStringDto })
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  title: LocalizedStringDto;

  @ApiProperty({ example: 'business-english' })
  @IsString()
  @Matches(SLUG_RE, { message: 'slug must be kebab-case' })
  slug: string;

  @ApiPropertyOptional({ type: PartialLocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialLocalizedStringDto)
  description?: PartialLocalizedStringDto;

  @ApiProperty({ enum: PROGRAM_CATEGORY })
  @IsEnum(PROGRAM_CATEGORY)
  category: ProgramCategory;

  @ApiPropertyOptional({ type: PartialLocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialLocalizedStringDto)
  level?: PartialLocalizedStringDto;

  @ApiPropertyOptional({ description: 'stored but hidden in MVP UI' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceAmount?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  priceCurrency?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateLanguageProgramDto extends PartialType(
  CreateLanguageProgramDto,
) {}
