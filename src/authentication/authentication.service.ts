import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login-response.interface';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthenticationService {
  // !CONSTRUCTOR

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // !METHODS

  // ! create user:
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...restOfUserData } = createUserDto;

      // * create new user:
      const newUser = new this.userModel({
        // * encrypt password:
        password: bcryptjs.hashSync(password, 10),
        ...restOfUserData,
      });

      // * save new user:
      await newUser.save();

      // * and now, since we dont want to return this info to user with password included (no matter how it looks like(talking about postman)), we must:

      const { password: _, ...restOfUserDataAfterEncrypt } = newUser.toJSON();

      return restOfUserDataAfterEncrypt;
      // * if password missing error, then you have to make password in entity ? (optional).
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `${createUserDto.email} already exists...`,
        );
      }
      throw new InternalServerErrorException(
        'something wrong has happened, please contact server admin...',
      );
    }
  }

  // ! authenticate user:
  async authenticate(
    authenticateUserDto: AuthenticateUserDto,
  ): Promise<LoginResponse> {
    const { email, password } = authenticateUserDto;
    // * check if user-email exist:
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException('invalid credentials... -email');
    }

    // * check if user-password is correct:
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('invalid credentials... -password');
      // * --- remember that password from authenticateUserDto is password being typed by user! user.password is password we have in db!
    }

    const { password: _, ...restOfUserDataNoPass } = user.toJSON();

    // * response:
    return {
      user: restOfUserDataNoPass,
      // * generate jwt:
      token: this.getJWT({ id: user.id }),
    };

    // * generate JWT:
  }

  async register(registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerUserDto);

    return {
      user: user,
      token: this.getJWT({ id: user._id }),
    };
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...restOfInfo } = user.toJSON();
    return restOfInfo;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
    return `This action updates a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }

  // ! JWT:
  getJWT(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
