import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  LocalizedStringDto,
  PartialLocalizedStringDto,
} from '../../../common/dto/localized-string.dto';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateCorporateProgramDto {
  @ApiProperty({ type: LocalizedStringDto })
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  title: LocalizedStringDto;

  @ApiProperty({ example: 'presentation-skills' })
  @IsString()
  @Matches(SLUG_RE, { message: 'slug must be kebab-case' })
  slug: string;

  @ApiPropertyOptional({ type: PartialLocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialLocalizedStringDto)
  description?: PartialLocalizedStringDto;

  @ApiPropertyOptional({ type: [LocalizedStringDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizedStringDto)
  outcomes?: LocalizedStringDto[];

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

export class UpdateCorporateProgramDto extends PartialType(
  CreateCorporateProgramDto,
) {}
