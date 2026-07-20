import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import type { IJwtUserRequest } from '../user/typings';
import { AddToCartDto, ChangeQuantityDto } from './dto/add-to-cart.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard) @ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'adding an item to the cart' }) @ApiResponse({ status: 200, description: 'Added a product' }) @ApiResponse({ status: 404, description: 'Not found' })
  addToCart(@Req() req: IJwtUserRequest, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, dto.productId, dto.quantity);
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' }) @ApiResponse({ status: 200, description: 'User cart' })
  getCart(@Req() req: IJwtUserRequest ) {
    return this.cartService.getCart(req.user.userId);
  }

  @Patch(':cartItemId')
  @ApiOperation({ summary: 'Change the quantity of a shopping cart item' }) @ApiResponse({ status: 200, description: 'The number of the basket item has been successfully changed' })
  changeQuantity(@Req() req: IJwtUserRequest, @Param('cartItemId') cartItemId: string, @Body() dto: ChangeQuantityDto) {
    return this.cartService.changeQuantity(req.user.userId, cartItemId, dto.quantity);
  }

  @Delete(':cartItemId')
  @ApiOperation({ summary: 'Delete a cart item' }) @ApiResponse({ status: 200, description: 'Cart item deleted successfully' })
  deleteCartItem(@Req() req: IJwtUserRequest, @Param('cartItemId') cartItem: string) {
    return this.cartService.deleteCartItem(req.user.userId, cartItem);
  }
}
