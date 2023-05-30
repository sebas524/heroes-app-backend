import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // !CONTRUCTOR
  constructor(
    private jwtService: JwtService,
    private authenticationService: AuthenticationService,
  ) {}
  // !METHODS
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('no bearer token found in request...');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SEED,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      const user = await this.authenticationService.findUserById(payload.id);
      if (!user) {
        throw new UnauthorizedException('user does not exist...');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('user is not active...');
      }

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
