import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticateUserDto, CreateUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authenticationService.create(createUserDto);
  }

  @Post('/authenticate')
  login(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.authenticationService.authenticate(authenticateUserDto);
  }

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authenticationService.register(registerUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req: Request) {
    return this.authenticationService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'] as User;
    return {
      user,
      token: this.authenticationService.getJWT({ id: user._id }),
    };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authenticationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAuthenticationDto: UpdateAuthenticationDto,
  // ) {
  //   return this.authenticationService.update(+id, updateAuthenticationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authenticationService.remove(+id);
  // }
}
