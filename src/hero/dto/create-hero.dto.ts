import { IsString, MinLength } from 'class-validator';

export class CreateHeroDto {
  @IsString() @MinLength(1) superhero: string;
  @IsString() @MinLength(1) publisher: string;
  @IsString() @MinLength(1) alterEgo: string;
  @IsString() @MinLength(1) firstAppearance: string;
  @IsString() @MinLength(1) characters: string;
}
