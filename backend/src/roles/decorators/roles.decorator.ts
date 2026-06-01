import { SetMetadata } from "@nestjs/common";
import { Role } from "../enums/role.enum";

export const ROLES_KEY = 'roles';  // Это ключ, под которым NestJS будет хранить список ролей.

// Тут мы просто создаем декоратор, который прикрепляет к методу контроллера дополнительную информацию
export const Roles = (...roles: Role[]) => {  // Тут мы создаем декоратор @Roles(), который принимает на вход роль или роли
    return SetMetadata(ROLES_KEY, roles)  // SetMetadata создает декоратор и прикрипляет к методу (т.е. к методу контроллера - route handler) "скрытую информацию", например: roles: ['admin']   
}  // кратко: Прикрепи к этому методу данные: ключ roles, значение ['admin']

