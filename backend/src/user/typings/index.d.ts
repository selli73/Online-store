import { Role } from "@prisma/client";

export interface IJwtUserRequest {
    user: {
        userId: string;
        email: string;
        role: Role;
    }
}

export interface IPasswordResetJwtUserRequest {
    user: {
        userId: string;
    }
}