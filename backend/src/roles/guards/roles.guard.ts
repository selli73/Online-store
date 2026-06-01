// Создаем класс, который сравнивает роли, назначенные текущему пользователю, с реальными ролями, требуемыми для текущего обрабатываемого маршрута.
// Для доступа к ролям маршрута (пользовательским метаданным) мы используем вспомогательный класс Reflector, который предоставляется NestJS

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private _reflector: Reflector ) {}

    canActivate(context: ExecutionContext) {
        
        // context - это объект Nestjs с информацией о текущем запросе
        const requiredRoles = this._reflector.get(ROLES_KEY, context.getHandler());
        
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        
        const request = context.switchToHttp().getRequest();
        const user = request.user;  // или можно использовать так: const{ user } = request Она берёт свойство user из объекта request и создаёт переменную с именем user.
        // в переменной user - лежат данные текущего пользователя: такие как id, email, roles и т.д.
        // предикат это функция, которая возвращает true или false
        
        return requiredRoles.some((role) => user?.role?.includes(role));
    }
}