import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(private _prisma: PrismaService) {}

    async create(userId: string, dto: CreateOrderDto) {
        if (dto.items.length === 0)  {
            throw new BadRequestException('Корзина пуста');
        }

        return this._prisma.$transaction(async (tx) => { 
            let totalAmount = 0;
            const orderItemsData: { productId: string; quantity: number; price: number; }[] = [];

            for (const item of dto.items) {
                const product = await this._prisma.product.findUnique({ where: { id: item.productId } });

                if (!product) {
                    throw new NotFoundException('Товар не существует');
                }

                if (product.stock < item.quantity) {
                    throw new BadRequestException('Недостаточно товара на складе');
                }

                await tx.product.update({ where: { id: product.id }, data: { stock: product.stock - item.quantity }});

                totalAmount += product.price * item.quantity;
                orderItemsData.push({ productId: product.id, quantity: item.quantity, price: product.price });
            }

            return tx.order.create({ data: { userId, total: totalAmount, items: { create: orderItemsData } }, include: { items: true } });
         });
    }

    async getOrders(userId: string) {
        return this._prisma.order.findMany({ where: { userId } });
    }
}