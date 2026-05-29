import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('user')
export class UserController {

    constructor(private readonly _userService: UserService) {}
    @ApiOperation({ summary: 'User registration'})
    @ApiResponse({ status: 201, description: 'The user is registered' })
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this._userService.register(dto);
    }

    @ApiOperation({ summary: "user authorization" })
    @ApiResponse({ status: 200, description: 'The user has successfully logged in' })
    @Post('login')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        return this._userService.login(dto);
    }
}
