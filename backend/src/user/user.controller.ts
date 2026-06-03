import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {

    constructor(private readonly _userService: UserService) {}
    
    @Post('register')
    @ApiOperation({ summary: 'User registration'}) @ApiResponse({ status: 201, description: 'The user is registered' })
    register(@Body() dto: RegisterDto) {
        return this._userService.register(dto);
    }

    @Post('login') @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "user authorization" }) @ApiResponse({ status: 200, description: 'The user has successfully logged in' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    login(@Body() dto: LoginDto) {
        return this._userService.login(dto);
    }
}
