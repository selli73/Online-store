import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LoginDto } from './create-user.dto';
import { IsEmail, IsString, Min, MinLength } from 'class-validator';


export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'old password', example: '12345678' })
    oldPassword!: string;

    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'new password', example: 'hardPassword' })
    newPassword!: string;
}

export class ForgotPasswordDto extends OmitType(LoginDto, ['password'] as const) {

}

export class VerifyResetCodeDto {
    
    @IsEmail()
    @IsString()
    @ApiProperty({ description: 'user email address', example: 'jonJones@gmail.com' })
    email!: string;

    @IsString()
    @ApiProperty({ description: 'the code that came to the email', example: 'D23bf6' })
    code!: string;
}

export class ResetPasswordDto extends OmitType(ChangePasswordDto, ['oldPassword'] as const) {

}