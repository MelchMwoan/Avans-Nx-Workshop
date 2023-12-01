
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./decorators/public.decorator";
import { IS_TRAINER_KEY } from "./decorators/trainer.decorator";
import { UserService } from '../user/user.service';
import { ITrainer } from '@avans-nx-workshop/shared/api';


@Injectable()
export class AuthGuard implements CanActivate {
  TAG = 'AuthGuard';
  constructor(private jwtService: JwtService, private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      Logger.warn("No token provided", this.TAG);
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;

      const isTrainer = this.reflector.getAllAndOverride<boolean>(
        IS_TRAINER_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isTrainer) {
        const userDetails = await this.userService.getOne(payload.email);
        console.log(userDetails)
        if (!userDetails || !(userDetails as ITrainer).loan) {
          Logger.warn('User is not a trainer', this.TAG);
          throw new UnauthorizedException('User is not a trainer');
        }
      }
    } catch (error: any){
      if(error.message == 'User is not a trainer') {
        Logger.warn('User is not a trainer', this.TAG);
        throw new UnauthorizedException('Only Trainers are allowed to do this');
      }
      Logger.warn("Illegal token" + error, this.TAG);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
