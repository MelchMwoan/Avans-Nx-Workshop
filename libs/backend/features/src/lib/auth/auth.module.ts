import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])
  ],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    UserService
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
