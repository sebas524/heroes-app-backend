import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        // * here we define all the models that will be allowed in module directly:
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '2h' },
    }),
  ],
})
export class AuthenticationModule {}
