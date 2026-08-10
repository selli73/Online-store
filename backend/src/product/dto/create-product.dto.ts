import { PartialType } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
    
    @ApiProperty({ description: 'Product name'})
    @IsString()
    @MaxLength(256)
    name!: string
    
    @ApiProperty({ description: 'Product price'})
    @IsNumber()
    @Min(-2147483648)
    @Max(2147483647)
    price!: number

    @ApiProperty({ description: 'Product quantity'})
    @IsNumber()
    @Min(1)
    @Max(2147483647)
    stock!: number

    @ApiProperty({ description: 'Product applications'})
    @IsString()
    @MaxLength(256)
    applicabilityToCars!: string

    @ApiProperty({  description: 'Product type'})
    @IsString()
    @MaxLength(256)
    partType!: string

    @ApiProperty({  description: 'Product manufacturer'})
    @IsString()
    @IsOptional()
    @MaxLength(256)
    manufacturer?: string

    @ApiProperty({ description: 'Product description' })
    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) { // PartialType() - делает поля опциональными при update

}