import { Controller, Body, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
@Controller('product')
export class ProductController {

    constructor(private readonly _productService: ProductService) {}

    @ApiOperation({ summary: 'Getting a list of all products' })
    @ApiResponse({ status: 200, description: 'Products received' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Get('all')
    getAllProduct() {
        return this._productService.products();
    }

    @ApiOperation({ summary: 'Product creation' })
    @ApiResponse({ status: 201, description: 'Product created' })
    @Post()
    createProduct(@Body() dto: CreateProductDto) {
        return this._productService.create(dto);
    }

    @ApiOperation({ summary: 'Product editing' })
    @ApiResponse({ status: 200, description: 'Products updated' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Put(':id')
    updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this._productService.update(id, dto);
    }

    @ApiOperation({ summary: 'Removing a product' })
    @ApiResponse({ status: 200, description: 'Products deleted' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Delete(':id')
    deleteProduct(@Param('id') id: string) {  // Через Param, переделать на id
        return this._productService.delete(id);
    }
}
