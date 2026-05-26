import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from './user.constants';
import { ProfileController } from '../profile/profile.controller';
@Module({
  imports: [JwtModule.register({
    secret: jwt.secret,
    signOptions: { expiresIn: '1d' }
  })],
  controllers: [UserController, ProfileController],
  providers: [UserService]
})
export class UserModule {}