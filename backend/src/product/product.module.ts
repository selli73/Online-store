import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtStrategy } from '../user/strategies/jwt.strategy';

@Module({
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
