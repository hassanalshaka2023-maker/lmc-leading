import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  LocalizedStringDto,
  PartialLocalizedStringDto,
} from '../../../common/dto/localized-string.dto';

class MembershipBenefitDto {
  @ApiPropertyOptional({ type: PartialLocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialLocalizedStringDto)
  title?: PartialLocalizedStringDto;

  @ApiPropertyOptional({ type: PartialLocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialLocalizedStringDto)
  body?: PartialLocalizedStringDto;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateMembershipContentDto {
  @ApiPropertyOptional({ type: PartialLocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialLocalizedStringDto)
  intro?: PartialLocalizedStringDto;

  @ApiPropertyOptional({ type: [MembershipBenefitDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MembershipBenefitDto)
  benefits?: MembershipBenefitDto[];

  @ApiPropertyOptional({
    type: LocalizedStringDto,
    description: 'descriptive text only — no points engine',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialLocalizedStringDto)
  pointsExplanation?: PartialLocalizedStringDto;
}
