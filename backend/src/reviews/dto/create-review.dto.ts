import { IsNumber, Min, Max, IsString, IsOptional } from "class-validator";

export class CreateReviewDto {
    
    @IsNumber()
    @Min(1)
    @Max(5)
    rating!: number;

    @IsString()
    productId!: string;

    @IsString()
    @IsOptional()
    text?: string;
}
