import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { PartialLocalizedStringDto } from '../../../common/dto/localized-string.dto';

export class SocialLinkDto {
  @ApiProperty({ example: 'instagram' })
  @IsString()
  @Matches(/^[a-z0-9-]{2,40}$/, {
    message: 'platform must be a lowercase slug (a-z, 0-9, -)',
  })
  platform: string;

  @ApiProperty({ example: 'https://instagram.com/leadingmastery' })
  @IsString()
  @MaxLength(300)
  @Matches(/^https?:\/\/.+/i, { message: 'url must start with http(s)://' })
  url: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateContactInfoDto {
  @ApiPropertyOptional({ maxLength: 40 })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @ApiPropertyOptional({ maxLength: 40, description: 'digits only' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  whatsapp?: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  email?: string;

  @ApiPropertyOptional({ type: PartialLocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialLocalizedStringDto)
  address?: PartialLocalizedStringDto;

  @ApiPropertyOptional({ maxLength: 600, description: 'Google Maps embed URL' })
  @IsOptional()
  @IsString()
  @MaxLength(600)
  @Matches(/^(https?:\/\/.+)?$/i, {
    message: 'mapEmbedUrl must be a valid http(s) URL, or empty',
  })
  mapEmbedUrl?: string;

  @ApiPropertyOptional({ type: [SocialLinkDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}
