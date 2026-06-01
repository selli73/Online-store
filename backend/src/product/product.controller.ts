import { Controller, Body, Query, Param, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { RolesGuard } from '../roles/guards/roles.guard';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('product')
export class ProductController {

    constructor(private readonly _productService: ProductService) {}

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.User)
    @ApiOperation({ summary: 'Getting a list of all products' }) @ApiResponse({ status: 200, description: 'Products received' }) @ApiResponse({ status: 404, description: 'Not found' })
    getAllProduct(@Query('page') page: number, @Query('limit') limit: number) {
        return this._productService.products(page, limit);
    }

    @Post() 
    @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.Admin) 
    @ApiOperation({ summary: 'Product creation' }) @ApiResponse({ status: 201, description: 'Product created' })
    createProduct(@Body() dto: CreateProductDto) {
        return this._productService.create(dto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.Admin)
    @ApiOperation({ summary: 'Product editing' }) @ApiResponse({ status: 200, description: 'Products updated' }) @ApiResponse({ status: 404, description: 'Not found' })
    updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this._productService.update(id, dto);
    }

    
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.Admin)
    @ApiOperation({ summary: 'Removing a product' }) @ApiResponse({ status: 200, description: 'Products deleted' }) @ApiResponse({ status: 404, description: 'Not found' })
    deleteProduct(@Param('id') id: string) {
        return this._productService.delete(id);
    }
}