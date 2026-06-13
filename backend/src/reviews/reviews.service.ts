import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {

  constructor(private _prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const hasBought = await this._prisma.order.findFirst({
      where: { userId, status: { in: [OrderStatus.PAID, OrderStatus.SHIPPED] }, items: { some: { productId: dto.productId } } }
    });

    if (!hasBought) {
      throw new ForbiddenException('Вы можете оставить отзыв только на купленном товаре');
    }

    const existUserReview = await this._prisma.review.findUnique({
      where: { 
        userId_productId: {
          userId,
          productId: dto.productId
        }
      }
    });

    if (existUserReview) {
      throw new ConflictException('Вы уже оставляли отзыв на этот товар. Редактировать можно только существующий отзыв.')
    }

    const review = await this._prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        rating: dto.rating,
        text: dto.text
      }
    });

    await this.updateProductAverageRating(dto.productId);

    return review;
  }

  private async updateProductAverageRating(productId: string) {
    const aggregations = await this._prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true }
    });

    await this._prisma.product.update({
      where: { id: productId },
      data: {
        rating: aggregations._avg.rating || 0
      }
    });
  }
}
