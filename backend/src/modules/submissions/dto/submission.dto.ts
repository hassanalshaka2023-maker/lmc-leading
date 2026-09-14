import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  SUBMISSION_STATUS,
  SUBMISSION_TYPE,
} from '../../../common/constants/enums';
import type {
  SubmissionStatus,
  SubmissionType,
} from '../../../common/constants/enums';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreateSubmissionDto {
  @ApiProperty({ enum: SUBMISSION_TYPE })
  @IsEnum(SUBMISSION_TYPE)
  type: SubmissionType;

  @ApiProperty({ maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ maxLength: 40 })
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  phone: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(160)
  email: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  serviceOfInterest?: string;

  @ApiProperty({ maxLength: 4000 })
  @IsString()
  @MinLength(5)
  @MaxLength(4000)
  message: string;
}

export class UpdateSubmissionDto {
  @ApiPropertyOptional({ enum: SUBMISSION_STATUS })
  @IsOptional()
  @IsEnum(SUBMISSION_STATUS)
  status?: SubmissionStatus;

  @ApiPropertyOptional({ maxLength: 4000 })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;
}

export class QuerySubmissionsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: SUBMISSION_STATUS })
  @IsOptional()
  @IsEnum(SUBMISSION_STATUS)
  status?: SubmissionStatus;

  @ApiPropertyOptional({ enum: SUBMISSION_TYPE })
  @IsOptional()
  @IsEnum(SUBMISSION_TYPE)
  type?: SubmissionType;
}
