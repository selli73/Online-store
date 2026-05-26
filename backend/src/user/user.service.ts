import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import  bcrypt  from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private _prisma: PrismaService, private _jwtService: JwtService) {}
    
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
                phone: dto.phone
            }
        });
        
        return this.generateToken(user.id, user.email);
    }


    async login(dto: LoginDto) {
        const user = await this._prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (!user) {
            throw new BadRequestException('Логин или пароль неверный');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Логин или пароль неверный');
        }

       return this.generateToken(user.id, user.email);
    }

    private generateToken(userId: string, email: string) {
        const payload = {
            sub: userId,
            email
        }
        return {
            access_token: this._jwtService.sign(payload)
        };
    }
}
