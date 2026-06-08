import { Controller, Body, Query, Param, Get, Post, Put, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../roles/decorators/roles.decorator';
import { RolesGuard } from '../roles/guards/roles.guard';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@Controller('product')
export class ProductController {

    constructor(private readonly _productService: ProductService) {}

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.USER, Role.ADMIN) @ApiBearerAuth()
    @ApiOperation({ summary: 'Getting a list of all products' }) @ApiResponse({ status: 200, description: 'Products received' }) @ApiResponse({ status: 404, description: 'Not found' })
    getAllProduct(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
        return this._productService.products(page, limit);
    }

    @Post() 
    @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @ApiBearerAuth()
    @ApiOperation({ summary: 'Product creation' }) @ApiResponse({ status: 201, description: 'Product created' })
    createProduct(@Body() dto: CreateProductDto) {
        return this._productService.create(dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @ApiBearerAuth()
    @ApiOperation({ summary: 'Product editing' }) @ApiResponse({ status: 200, description: 'Products updated' }) @ApiResponse({ status: 404, description: 'Not found' })
    updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this._productService.update(id, dto);
    }

    
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @ApiBearerAuth()
    @ApiOperation({ summary: 'Removing a product' }) @ApiResponse({ status: 200, description: 'Products deleted' }) @ApiResponse({ status: 404, description: 'Not found' })
    deleteProduct(@Param('id') id: string) {
        return this._productService.delete(id);
    }
}