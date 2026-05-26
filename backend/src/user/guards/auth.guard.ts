import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(private readonly _jwtService: JwtService) {}
    
    // метод canActivate() - вызывается всегда, когда пользователь пытается попасть на защищенный route
    // Перед выполнением getProfile() NestJS сначала вызовет canActivate().
    // Если метод вернёт true, запрос пройдёт дальше.
    // Если выбросит ошибку — запрос будет заблокирован.
    canActivate(context: ExecutionContext) /*: boolean | Promise<boolean> | Observable<boolean>*/ {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = this._jwtService.verify(token);
            
            request['user'] = payload;
        }
        catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}