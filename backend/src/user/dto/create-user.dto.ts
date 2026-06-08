import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Role as PrismaRole } from '@prisma/client';

export class LoginDto {  
    @ApiProperty({ description: 'user email address', example: 'jonJones@gmail.com' })
    @IsEmail()
    email!: string;
    
    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'Minimum length password of 8 characters', example: 'hardPassword' })
    password!: string;
}

export class RegisterDto extends LoginDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Name user', example: 'Bob' })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({  description: 'Phone user', example: '+7 (9**) ***-**-**'})
    phone?: string;

    @ApiProperty({  description: 'Role user', example: 'User or admin'})
    role!: PrismaRole
}