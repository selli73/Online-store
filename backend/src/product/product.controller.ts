import { Controller, Body, Query, Param, Get, Post, Put, Delete, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ApiResponse, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Roles } from '../roles/decorators/roles.decorator';
import { RolesGuard } from '../roles/guards/roles.guard';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { extname } from 'node:path';
import { FileUploadDto } from './dto/file-upload.dto';

@Controller('product') 
@UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth()
export class ProductController {

    constructor(private readonly _productService: ProductService) {}

    @Get('all')
    @Roles(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Getting a list of all products' }) @ApiResponse({ status: 200, description: 'Products received' }) @ApiResponse({ status: 404, description: 'Not found' })
    getAllProduct(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
        return this._productService.products(page, limit);
    }

    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this._productService.getProductById(id);
    }

    @Get('search')
    @Roles(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Search products by filter' }) @ApiResponse({ status: 200, description: 'Products received' }) @ApiResponse({ status: 404, description: 'Not found' })
    searchProducts(@Query('query') name: string) {
        return this._productService.searchProducts(name);
    }

    @Post() 
    @Roles(Role.ADMIN) 
    @ApiOperation({ summary: 'Product creation' }) @ApiResponse({ status: 201, description: 'Product created' })
    createProduct(@Body() dto: CreateProductDto) {
        return this._productService.create(dto);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Product editing' }) @ApiResponse({ status: 200, description: 'Products updated' }) @ApiResponse({ status: 404, description: 'Not found' })
    updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this._productService.update(id, dto);
    }

    
    @Delete(':id')
    @Roles(Role.ADMIN) 
    @ApiOperation({ summary: 'Removing a product' }) @ApiResponse({ status: 200, description: 'Products deleted' }) @ApiResponse({ status: 404, description: 'Not found' })
    deleteProduct(@Param('id') id: string) {
        return this._productService.delete(id);
    }

    @Post(':id/image')
    @Roles(Role.ADMIN) @ApiConsumes('multipart/form-data') @ApiBody({
        type: FileUploadDto
    })
    @UseInterceptors(FileInterceptor('file', { 
        storage: diskStorage({ 
            destination: './uploads',
            filename: (req, file, callback) => { 
                const uniqueName = `${v4()}${extname(file.originalname)}`;
                callback(null, uniqueName);
            }   
        }),
        limits: {
            fileSize: 5*1024*1024
        },
        fileFilter: (req, file, callback) => {
            if (!/^image\/(png|jpe?g)$/.test(file.mimetype)) {
                callback(new BadRequestException('The file type is incorrect'), false);
            }
            callback(null, true);
        }
    }))
    async uploadProductImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        const fileUrl = `/uploads/${file.filename}`;

        await this._productService.uploadProductImage(id, fileUrl);

        return {
            message: 'Invalid uploaded successfully',
            imageUrl: fileUrl
        };
    }
}