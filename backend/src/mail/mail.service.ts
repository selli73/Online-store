import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private _transporter: nodemailer.Transporter;

    constructor(private _configService: ConfigService) {
        this._transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: _configService.getOrThrow('SMTP_EMAIL'),
                pass: _configService.getOrThrow('SMTP_PASSWORD'),
            }
        });
    }

    async sendWelcomeEmail(to: string, name: string) {
        const htmlContent = ` 
            <h1>Добро пожаловать, ${name}!</h1> 
            <p>Спасибо за регистрацию в нашем магазине автозапчастей.</p> 
            <p>Удачных покупок!</p> 
        `;

        await this._transporter.sendMail({
            from: 'Автомир',
            to,
            subject: 'Успешная регистрация',
            html: htmlContent
        });
    }

    async sendCodeEmail(to: string, passwordResetCode: string) {
        const htmlContent = ` 
            <h1>Создан временный код</h1> 
            <p>Ваш код для восстановления пароля:</p>
            <h1 style="letter-spacing: 5px;">
            ${passwordResetCode}
            </h1>
        `;

        await this._transporter.sendMail({
            from: 'Автомир',
            to,
            subject: 'Код сброса пароля',
            html: htmlContent
        });
    }
}