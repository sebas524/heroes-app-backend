import { IsEmail, IsString, MinLength } from 'class-validator';

// * what info do i need to create a user in db?
export class CreateUserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}
