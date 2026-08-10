import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min, Max, IsString, IsOptional, MaxLength } from "class-validator";

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
    @MaxLength(1000)
    text?: string;
}

export class ChangeReviewDto extends CreateReviewDto {

}