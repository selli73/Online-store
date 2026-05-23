import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly _userService: UserService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this._userService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this._userService.login(dto);
    }
}
