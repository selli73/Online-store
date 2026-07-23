import { ApiProperty, PickType } from "@nestjs/swagger";
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
    
    @IsString()
    cartItemId!: string;
    
    @IsInt()
    @Min(0)
    @ApiProperty({ description: 'Product quantity' })
    quantity!: number;
}

export class DeleteDto extends PickType(ChangeQuantityDto, ['cartItemId'] as const) {}