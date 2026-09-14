import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsJWT,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@lmc.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ChangeMe!2026', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsJWT()
  refreshToken: string;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@lmc.local' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'admin@lmc.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @Matches(/^\d{6}$/, { message: 'code must be a 6-digit number' })
  code: string;

  @ApiProperty({ example: 'NewPassword1', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}
