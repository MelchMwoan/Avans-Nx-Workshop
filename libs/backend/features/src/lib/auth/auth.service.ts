import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from '@nestjs/jwt';

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

    const payload = { sub: (await user).id, user: user };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
