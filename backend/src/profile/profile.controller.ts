import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from '../user/guards/auth.guard';
@Controller('profile')
export class ProfileController {
    @Get('me')
    @UseGuards(AuthGuard)
    getProfile(@Req() request) {
        return {
            message: 'Доступ разрешен',
            user: request.user
        }
    }
}