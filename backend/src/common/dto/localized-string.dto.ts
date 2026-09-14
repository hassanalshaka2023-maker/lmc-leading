import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/** Payload shape for a bilingual `{ ar, en }` field. */
export class LocalizedStringDto {
  @ApiProperty({ example: 'العنوان بالعربية' })
  @IsString()
  @MaxLength(5000)
  ar: string;

  @ApiProperty({ example: 'Title in English' })
  @IsString()
  @MaxLength(5000)
  en: string;
}

/** Same, but every side optional — for PATCH bodies. */
export class PartialLocalizedStringDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  ar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  en?: string;
}
