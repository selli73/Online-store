import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwt } from '../user.constants';
import { Injectable } from '@nestjs/common';

// с помощью библиотеки @nestjs/passport вы настраиваете стратегию Passport, расширяя PassportStrategy класс
// с помощью библиотеки passport-jwt она предоставляет тип стратегии, а в данном случае тип Jwt Strategy. + нужна библиотека @types/passport-jwt.

// Это основная логика проверки JWT.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {  // PassportStrategy() - это функция, если не задать ей имя, то по умолчанию для данной стратегии (например 'jwt' для jwt-strategy)
    constructor() {
        // в super() передан объект с параметрами:
            // jwtFromRequest - предоставляет метод, с помощью которого будет извлечен из Request
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Это означает, что токен будет доставаться из HTTP-заголовка
            ignoreExpiration: false, // Это значит, что Passport будет проверять срок действия токена.
            secretOrKey: jwt.secret  // Это секретный ключ, с помощью которого проверяется подпись JWT.
        });
    }

    // метод validate() в @nestjs/passport 
    // В случае стратегией с JWT, Passport сначала проверяет подпись JWT и декодирует JSON.Затем он вызывает validate() метод,
    // передавая декодированный JSON в качестве единственного параметра.
    // То есть Passport достает JWT из заголовка Authorization: Bearer <token>, JWT проверяется по секретному ключу
    // Если токен валидный, вызывается validate(payload), куда передается декодированный payload
    // Результат validate() кладётся в request.user
    //Контроллер возвращает данные пользователя.
    validate(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
        // Passport создаст user объект на основе возвращенного значения нашего validate() метода и добавит его в качестве свойства 
        // к объекту request
    }
}

// Используем AuthGuard, который @nestjs/passport автоматически создает при расширении стратегии passport-jwt