import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, DeleteProductDto, UpdateProductDto } from './dto/create-product.dto';

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
                applicabilityToCars: dto.applicabilityToCars,
                partType: dto.partType,
                manufacturer: dto.maufacturer,
                description: dto.description
            }
        });
        return product;
    }

    async products() {
        return this._prisma.product.findMany()
    }

    async update(dto: UpdateProductDto) {
        // условие на то что есть эта запись или нет
        
        return this._prisma.product.update({
            where: { name: dto.name },
            data: dto
        });
    }

    async delete(dto: DeleteProductDto) {
        return this._prisma.product.delete({
            where: dto
        })
    }
}
