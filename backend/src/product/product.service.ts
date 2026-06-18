import { BadRequestException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private _prisma: PrismaService, @Inject(CACHE_MANAGER) private _cacheManager: Cache) {}
    
    async create(dto: CreateProductDto) {
        const existionUser = await this._prisma.product.findUnique({
            where: { name: dto.name }
        });

        if (existionUser) {
            throw new BadRequestException('Товар с таким наименование уже существует');
        }

        const product = this._prisma.product.create({
            data: {
                name: dto.name,
                price: dto.price,
                stock: dto.quantity,
                applicabilityToCars: dto.applicabilityToCars,
                partType: dto.partType,
                manufacturer: dto.maufacturer,
                description: dto.description
            }
        });
        return product;
    }

    async products(page: number, limit: number) {
        const cacheKey = `productsAll:${page}:${limit}`;
        const cacheData = await this._cacheManager.get<Product[]>(cacheKey);

        if (cacheData) {
            return cacheData;
        }

        const products = await this._prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { name: 'asc' }
        });
        
        await this._cacheManager.set(cacheKey, products, 1000*60*60);

        return products;
    }

    async searchProducts(query: string) {
        const splitName = query.trim().split(/\s+/).filter((word)=> Boolean(word));
        
        if (splitName.length === 0) {
            return [];
        }
        
        const cacheKey = `searchProducts:${query.trim()}`;
        const cacheData= await this._cacheManager.get<Product[]>(cacheKey);

        if (cacheData) {
            console.log(cacheData);
            return cacheData;
        }

        const products = await this._prisma.product.findMany({
            where: {
                AND: splitName.map((word) =>  ({
                    OR: [
                        {
                            name: {
                                contains: word,
                                mode: 'insensitive'
                            }
                        },
                        {
                            applicabilityToCars: {
                                contains: word,
                                mode: 'insensitive'
                            }
                        },
                        {
                            partType: {
                                contains: word,
                                mode: 'insensitive'
                            }
                        },
                        {
                            manufacturer: {
                                contains: word,
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: word,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }))
            }
        });

        if (!products) {
            throw new NotFoundException('Not found product');
        }

        await this._cacheManager.set(cacheKey, products, 1000*60*60)

        return products;
    }

    async update(id: string, dto: UpdateProductDto) {
        await this.findOne(id);

        return this._prisma.product.update({
            where: { id },
            data: dto
        });
    }

    async delete(id: string) {
        await this.findOne(id);

        return this._prisma.product.delete({
            where: { id }
        });
    }

    async findOne(id: string) {
        const existingProduct = await this._prisma.product.findUnique({ where: { id } });

        if (!existingProduct) {
            throw new NotFoundException('This product does not exist');
        }

        return existingProduct;
    }

    async uploadProductImage(id: string, imageUrl: string) {
        await this.findOne(id);

        return this._prisma.product.update({
            where: { id },
            data: { imageUrl }
        });
    }
}