import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProfileController } from './profile/profile.controller';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UserModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
