import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UserModule, ProductModule, OrdersModule
    , MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
