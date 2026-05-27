import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Это guard, который использует стратегию Passport с именем 'jwt'. Для проверки этого запроса используй Passport-стратегию jwt.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}