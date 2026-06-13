import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import  bcrypt  from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
    constructor(private _prisma: PrismaService, private _jwtService: JwtService,  private _mailService: MailService) {}
    
    async register(dto: RegisterDto) {
        const existingUser = await this._prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new BadRequestException('Пользователь с таким email уже есть');
        }
        
        const hashPassword = await bcrypt.hash(dto.password, 10)
        const user = await this._prisma.user.create({
            data: {
                email: dto.email,
                password: hashPassword,
                name: dto.name,
                phone: dto.phone,
                role: dto.role
            }
        });

        if (user) {
            this._mailService.sendWelcomeEmail(user.email, user.name || '');
        }
        
        return this.generateToken(user.id, user.email, user.role);
    }


    async login(dto: LoginDto) {
        const user = await this._prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (!user) {
            throw new UnauthorizedException('Логин или пароль неверный');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Логин или пароль неверный');
        }

       return this.generateToken(user.id, user.email, user.role);
    }

    private generateToken(userId: string, email: string, role: string) {
        const payload = {
            sub: userId,
            email,
            role
        }
        return {
            access_token: this._jwtService.sign(payload)
        };
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const existingUser = await this._prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new NotFoundException('Этот пользователь не существует');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Пароль неверный');
        }

        const newhashedPassword = await bcrypt.hash(newPassword, 10)
        
        const updateData = await this._prisma.user.update({
            where: { id: existingUser.id },
            data: { password: newhashedPassword }
        });

        const {
            password,...objectWithoutPassword
        } = updateData;

        return objectWithoutPassword;
    }

    async forgotPassword(email: string) {
        const user = await this._prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return {
                message: "if this user exists, they will receive an email"
            };
        }
        
        const passwordResetRecord = await this._prisma.passwordResetCode.findUnique({
            where: { userId: user.id }
        });
        const resetCode = nanoid(6);
        const hashResetToken = await bcrypt.hash(resetCode, 10); 

        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 15);

        if (!passwordResetRecord) {
            await this._prisma.passwordResetCode.create({
                data: {
                    userId: user.id,
                    codeHash: hashResetToken,
                    expiryDate
                },
            });
        } else {
            await this._prisma.passwordResetCode.update({
                where: {
                    userId: user.id
                },
                data: {
                    codeHash: hashResetToken,
                    expiryDate
                }
            });
        }

        await this._mailService.sendCodeEmail(email, resetCode);

        return {
            message: "if this user exists, they will receive an email"
        };
    }

    async verifyResetCode(email: string, code: string) {
        const user = await this._prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new BadRequestException('Ошибка на стороне пользователя');
        }

        const passwordResetCode = await this._prisma.passwordResetCode.findUnique({
            where: { userId: user.id }
        });

        if (!passwordResetCode) {
            throw new BadRequestException('Неверный или истекший код');
        }

        if (passwordResetCode.expiryDate < new Date()) {
            throw new BadRequestException('Неверный или истекший код');
        }

        const isCodeValid = await bcrypt.compare(code, passwordResetCode.codeHash);

        if (!isCodeValid) {
            throw new BadRequestException('Неверный или истекший код');
        }

        await this._prisma.passwordResetCode.delete({
            where: { userId: user.id }
        });

        const payload = {
            userId: user.id,
            type: 'password-reset'
        };

        return { 
            resetToken: this._jwtService.sign(payload, { expiresIn: '10m' })
        };
    }

    async resetPassword(userId: string, dto: ResetPasswordDto) {
        const user = await this._prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const hashPassword = await bcrypt.hash(dto.newPassword, 10);
        await this._prisma.user.update({
            where: { id: user.id },
            data: { password: hashPassword }
        });

        return {
            message: 'Пароль успешно изменен'
        };
    }
}