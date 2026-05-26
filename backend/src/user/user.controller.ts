import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from './guards/auth.guard';


@Controller('user')
export class UserController {

    constructor(private readonly _userService: UserService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this._userService.register(dto);
    }
    @UseGuards(AuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        return this._userService.login(dto);
    }
}
