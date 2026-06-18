import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { ReviewsModule } from './reviews/reviews.module';
import { CacheModule } from '@nestjs/cache-manager'
import KeyvRedis from '@keyv/redis'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, UserModule, ProductModule, OrdersModule
    , MailModule, ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'uploads'), serveRoot: '/uploads/' }), ReviewsModule,
    CacheModule.register({
      isGlobal: true,
      stores: [new KeyvRedis('redis://localhost:6379')]
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}