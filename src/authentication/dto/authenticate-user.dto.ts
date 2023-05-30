import { IsEmail, MinLength } from 'class-validator';

export class AuthenticateUserDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}
