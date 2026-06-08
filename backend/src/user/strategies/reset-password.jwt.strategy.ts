import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { jwt } from '../user.constants'

@Injectable()
export class ResetPasswordJwtStrategy extends PassportStrategy(Strategy, 'jwt-reset-password') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwt.secret
        });
    }

    validate(payload) {
        if (payload.type !== 'password-reset') {
            throw new BadRequestException('Недействительный токен');
        }
        
        return {
            userId: payload.userId
        };
    }
}