import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(private _prisma: PrismaService) {}
    
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
        return this._prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { name: 'asc' }
        });
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
