import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email!: string;
    
    @IsString()
    @MinLength(8)
    password!: string;
}

export class RegisterDto extends LoginDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}