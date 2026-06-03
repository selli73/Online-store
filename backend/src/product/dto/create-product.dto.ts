import { PartialType } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, Min } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
    
    @ApiProperty({ description: 'Product name'})
    @IsString()
    name!: string
    
    @ApiProperty({ description: 'Product price'})
    @IsNumber()
    price!: number

    @ApiProperty({ description: 'Product quantity'})
    @IsNumber()
    @Min(1)
    quantity!: number

    @ApiProperty({ description: 'Product applications'})
    @IsString()
    applicabilityToCars!: string

    @ApiProperty({  description: 'Product type'})
    @IsString()
    partType!: string

    @ApiProperty({  description: 'Product manufacturer'})
    @IsString()
    @IsOptional()
    maufacturer?: string

    @ApiProperty({ description: 'Product description' })
    @IsString()
    @IsOptional()
    description?: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) { // PartialType() - делает поля опциональными при update

}