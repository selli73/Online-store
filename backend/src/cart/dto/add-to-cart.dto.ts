import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class AddToCartDto {
    @IsString()
    @ApiProperty({ description: 'product id' })
    productId!: string;

    @IsInt()
    @IsOptional()    
    @Min(1)
    @ApiProperty({ description: 'Product quantity' })
    quantity!: number;
}

export class ChangeQuantityDto {
    @IsInt()
    @Min(0)
    @ApiProperty({ description: 'Product quantity' })
    quantity!: number;
}