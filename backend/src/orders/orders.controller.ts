import { Controller, UseGuards, Body, Param, Post, Get, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
    
    @Get(':userId')
    @UseGuards(JwtAuthGuard) @ApiBearerAuth()
    @ApiOperation({ summary: 'Getting a list of orders' }) @ApiResponse({ status: 200, description: 'List of orders received'}) @ApiResponse({ status: 404, description: 'Not found' })
    getOrders(@Req() req) {
      return this.ordersService.getOrders(req.user.userId);
    }

    @Post(':userId')
    @UseGuards(JwtAuthGuard) @ApiBearerAuth()
    @ApiOperation({ summary: 'Create an order' }) @ApiResponse({ status: 401, description: 'Unauthorized' }) @ApiResponse({ status: 201, description: 'order created' })
    create(@Req() req, @Body() dto: CreateOrderDto) {
      return this.ordersService.create(req.user.userId, dto);
    }
}