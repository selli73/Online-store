import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min, Max, IsString, IsOptional } from "class-validator";

export class CreateReviewDto {
    
    @ApiProperty({ description: 'Product rating', example: '5' })
    @IsNumber() @Min(1) @Max(5)
    rating!: number;

    @ApiProperty({ description: 'Product id' })
    @IsString()
    productId!: string;

    @ApiProperty({ description: 'Comment on the product', example: 'The product matches the price, so I give it a 5 rating.' })
    @IsString()
    @IsOptional()
    text?: string;
}
