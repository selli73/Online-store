import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Role as PrismaRole } from '@prisma/client';

export class LoginDto {  
    @ApiProperty({ description: 'user email address', example: 'jonJones@gmail.com' })
    @IsEmail()
    @MaxLength(256)
    email!: string;
    
    @IsString()
    @MinLength(8)
    @MaxLength(256)
    @ApiProperty({ description: 'Minimum length password of 8 characters', example: 'hardPassword' })
    password!: string;
}

export class RegisterDto extends LoginDto {
    @IsString()
    @IsOptional()
    @MaxLength(256)
    @ApiProperty({ description: 'Name user', example: 'Bob' })
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(256)
    @ApiProperty({  description: 'Phone user', example: '+7 (9**) ***-**-**'})
    phone?: string;

    @ApiProperty({  description: 'Role user', example: 'User or admin'})
    role!: PrismaRole
}