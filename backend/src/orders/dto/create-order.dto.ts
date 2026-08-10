import { Type } from "class-transformer"
import { IsArray, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'


export class OrderItemDto {
    @IsString()
    @ApiProperty({ description: 'Product id' })
    productId!: string

    @IsNumber()
    @Min(1)
    @Max(2147483647)
    @ApiProperty({ description: 'Product quantity' })
    quantity!: number
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @ApiProperty({ description: 'Product list' })
    items!: OrderItemDto[]
}