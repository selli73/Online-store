import { Controller, UseGuards, Body, Param, Post, Get, Patch, Req, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import type { IJwtUserRequest } from '../user/typings';

@Controller('orders')
@UseGuards(JwtAuthGuard) @ApiBearerAuth() @ApiResponse({ status: 401, description: 'Unauthorized' })
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
    
    @Get()
    @ApiOperation({ summary: 'Getting a list of orders' }) @ApiResponse({ status: 200, description: 'List of orders received'}) @ApiResponse({ status: 404, description: 'Not found' })
    getOrders(@Req() req: IJwtUserRequest) {
      return this.ordersService.getOrders(req.user.userId);
    }

    @Post()
    @ApiOperation({ summary: 'Create an order' })  @ApiResponse({ status: 201, description: 'order created' })
    create(@Req() req: IJwtUserRequest, @Body() dto: CreateOrderDto) {
      return this.ordersService.create(req.user.userId, dto);
    }

    @Patch(':orderId/pay')
    @ApiOperation({ summary: 'Payment for the order' }) @ApiResponse({ status: 200, description: 'Order paid' })
    payOrder(@Param('orderId') orderId: string, @Req() req: IJwtUserRequest) {
      return this.ordersService.payOrder(orderId, req.user.userId);
    }

    @Get(':orderId/payment-details')
    @ApiOperation({ summary: 'Receiving payment details' }) @ApiResponse({ status: 200, description: 'Payment details have been successfully received' })
    getPaymentDetails(@Param('orderId') orderId: string , @Req() req: IJwtUserRequest) {
      return this.ordersService.getPaymentDetails(orderId, req.user.userId);
    }
}