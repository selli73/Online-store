import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class PasswordResetJwt extends AuthGuard('jwt-reset-password') {}