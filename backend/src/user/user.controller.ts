import { Controller, Req, Body, UseGuards, HttpStatus, HttpCode, Put, Post } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, VerifyResetCodeDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PasswordResetJwt } from './guards/jwt-passwordReset.guard';
import type { IPasswordResetJwtUserRequest } from './typings';

@Controller('user')
export class UserController {

    constructor(private readonly _userService: UserService) {}
    
    @Post('register')
    @ApiOperation({ summary: 'User registration'}) @ApiResponse({ status: 201, description: 'The user is registered' })
    register(@Body() dto: RegisterDto) {
        return this._userService.register(dto);
    }

    @Post('login') @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'user authorization' }) @ApiResponse({ status: 200, description: 'The user has successfully logged in' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    login(@Body() dto: LoginDto) {
        return this._userService.login(dto);
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard) @ApiBearerAuth()
    @ApiOperation({ summary: 'Change user password' }) @ApiResponse({ status: 200, description: 'The user password has been successfully changed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    changePassword(@Req() request, @Body() dto: ChangePasswordDto) {
        return this._userService.changePassword(
            request.user.userId,
            dto.oldPassword,
            dto.newPassword,
        );
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Sends a code by email', description: 'We generate the code, save the code in the database and it by email' }) 
    @ApiResponse({ status: 200, description: 'The code was successfully sent to your email' })
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this._userService.forgotPassword(forgotPasswordDto.email);
    }

    @Post('verify-reset-code')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Code verify '}) @ApiResponse({ status: 200, description: 'Code is valid' })
    verifyResetCode(@Body() dto: VerifyResetCodeDto) {
        return this._userService.verifyResetCode(dto.email, dto.code);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK) @UseGuards(PasswordResetJwt)
    @ApiBearerAuth() @ApiOperation({ summary: 'Setting a new password' }) @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 200, description: 'The user has successfully set a new password' })
    resetPassword(@Req() request: IPasswordResetJwtUserRequest, @Body() dto: ResetPasswordDto ) {
        return this._userService.resetPassword(request.user.userId, dto);
    }
}