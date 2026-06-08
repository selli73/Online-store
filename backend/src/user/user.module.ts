import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from './user.constants';
import { ProfileController } from '../profile/profile.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { ResetPasswordJwtStrategy } from './strategies/reset-password.jwt.strategy';

@Module({
  imports: [JwtModule.register({
    secret: jwt.secret,
    signOptions: { expiresIn: '1d' }
  }), MailModule],
  controllers: [UserController, ProfileController],
  providers: [UserService, JwtStrategy, ResetPasswordJwtStrategy]
})
export class UserModule {}