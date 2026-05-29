import { Controller, Get, Req, UseGuards } from "@nestjs/common";
//import { AuthGuard } from '../user/guards/auth.guard';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse } from "@nestjs/swagger";
@Controller('profile')
export class ProfileController {
    
    
    // При обращении к нашему Get '/profile/me' маршруту Guard автоматически вызовет нашу пользовательскую стратегию passport-jwt,
    // проверит JWT и присвоит свойству user объекта Request.
    // Это значит: прежде чем выполнить метод getProfile, NestJS сначала запустит JwtAuthGuard.
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Getting the current user data' })
    @ApiResponse({ status: 200, description: 'Profile received successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(@Req() request) {
        return {
            message: 'Доступ разрешен',
            user: request.user
        }
    }
}