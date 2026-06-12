import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {

  constructor(private _prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const hasBought = await this._prisma.order.findFirst({
      where: { userId, status: { in: [OrderStatus.PAID, OrderStatus.SHIPPED] }, items: { some: { productId: createReviewDto.productId } } }
    });

    if (!hasBought) {
      throw new ForbiddenException('Вы можете оставить отзыв только на купленном товаре');
    }

    const review = await this._prisma.review.create({
      data: {
        userId,
        productId: createReviewDto.productId,
        rating: createReviewDto.rating,
        text: createReviewDto.text
      }
    });

    await this.updateProductAverageRating(createReviewDto.productId);

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
