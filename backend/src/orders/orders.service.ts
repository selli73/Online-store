import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
    constructor(private _prisma: PrismaService, private _configService: ConfigService) {}

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

            const order = await tx.order.create({ data: { userId, total: totalAmount, items: { create: orderItemsData } }, include: { items: true } });

            await tx.cartItem.deleteMany({
                where: {
                    cart: {
                        userId
                    },
                    productId: {
                        in: dto.items.map(item => item.productId)
                    }
                }
            });

            return order;
         });
    }

    async getOrders(userId: string) {
        return this._prisma.order.findMany({ where: { userId } });
    }

    async notifyManualPayment(orderId: string, userId: string) {
        const order = await this._prisma.order.findUnique({
            where: { id: orderId }
        });
        
        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }

        if (order.userId !== userId) {
            throw new ForbiddenException('Это не ваш заказ');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Это заказ оплачен или отменен');
        }

        return this._prisma.order.update({ where: { id: orderId }, data: { status: OrderStatus.AWAITING_CONFIRMATION} });
    }

    async getPaymentDetails(orderId: string, userId: string) {
        const order = await this._prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }

        if (order.userId !== userId) {
            throw new ForbiddenException('Это не ваш заказ');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Заказ уже в обработке или оплачен');
        }

        return {
            cardNumber: this._configService.getOrThrow('BANK_CARD_NUMBER'),
            receiverName: this._configService.getOrThrow('BANK_RECEIVER_NAME'),
            bankName: this._configService.getOrThrow('BANK_NAME'),
            amountToPay: order.total,
            instruction: `Обязательно укажите комментарий к переводу: заказ №${order.orderNumber}`
        }
    }

    async confirmPayment(orderId: string) {
        const order = await this._prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            throw new NotFoundException('Заказ был не найден');
        }

        if (order.status !== OrderStatus.AWAITING_CONFIRMATION) {
            throw new BadRequestException('Этот заказ не ожидает подтверждения оплаты');
        }

        return this._prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.PAID }
        });
    }
}