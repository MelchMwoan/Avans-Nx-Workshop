import { ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from '@nestjs/jwt';
import { IPlayer, ITrainer, IUser } from "@avans-nx-workshop/shared/api";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: any) {
    const user = this.usersService.getOne(email);
    this.logger.log(`email: ${email} trying to authenticate...`);
    if (!await this.usersService.validatePassword(pass, (await user).password!)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: (await user).id, email: (await user).email };
    const {password, ...returnUser} = JSON.parse(JSON.stringify(await user)) as unknown as IPlayer | ITrainer;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: returnUser,
    };
  }
  
  async checkOwner(context: ExecutionContext, user: IUser) {
    const request = context.switchToHttp().getRequest();
    if(request['email'] != user.email) throw new UnauthorizedException("You are not the owner");
  }
}
