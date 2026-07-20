import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private _prisma: PrismaService) {}

    async addToCart(userId: string, productId: string, quantity: number) {
        const product = await this._prisma.product.findUnique({
            where: {
                id: productId
            }
        });

        if (!product) {
            throw new NotFoundException('Товар не найден');
        }

        if (quantity > product.stock) {
            throw new BadRequestException('Недостаточно товара на складе');
        }

        let cart = await this._prisma.cart.findUnique({
            where: {
                userId
            }
        });

        if (!cart) {
            cart = await this._prisma.cart.create({
                data: {
                    userId
                }
            });
        }

        const existingItem = await this._prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });

        if (existingItem) {
            return this._prisma.cartItem.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: existingItem.quantity + quantity
                }
            });
        }

        return this._prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity
            }
        })
    }

    async getCart(userId: string) {
        const cart = await this._prisma.cart.findUnique({
            where: {
                userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) {
            return {
                items: []
            };
        }

        return cart;
    }

    async changeQuantity(userId: string, cartItemId: string, quantity: number) {
        const cartItem = await this._prisma.cartItem.findUnique({
            where: {
                id: cartItemId
            },
            include: {
                cart: true
            }
        });

        if (!cartItem) {
            throw new NotFoundException('Товар в корзине не найден');
        }

        if (cartItem.cart.userId !== userId) {
            throw new ForbiddenException();
        }

        if (quantity === 0) {
            await this._prisma.cartItem.delete({
                where: {
                    id: cartItemId
                }
            });

            return {
                message: 'Товар удален из корзины'
            }
        }

        const product = await this._prisma.product.findUnique({
            where: {
                id: cartItem.productId
            }
        });

        if (!product) {
            throw new NotFoundException('Товар не найден');
        }

        if (quantity > product.stock) {
            throw new BadRequestException('Недостаточно товара на складе');
        }

        return this._prisma.cartItem.update({
            where: {
                id: cartItemId,                
            }, 
            data: {
                quantity
            }
        });
    }

    async deleteCartItem(userId: string, cartItemId: string) {

        const existCart = await this._prisma.cartItem.findUnique({
            where: {
                id: cartItemId
            },
            include: {
                cart: true
            }
        });

        if (!existCart) {
            throw new NotFoundException('Товар в корзине не найден');
        }

        if (existCart.cart.userId !== userId) {
            throw new ForbiddenException()
        }

        await this._prisma.cartItem.delete({
            where: {
                id: cartItemId
            }
        });

        return {
            message: 'Товар удален из корзины'
        };
    }
}
