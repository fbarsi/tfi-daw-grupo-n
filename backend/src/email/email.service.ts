import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import hbs from 'nodemailer-express-handlebars';
import * as path from 'path';
import * as QRCode from 'qrcode';


@Injectable()
export class EmailService {
   private transporter;

   constructor(private configService:ConfigService){
    this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: this.configService.get<string>('MAIL_USER'),
            pass: this.configService.get<string>('MAIL_PASS'),
        }
    })

    this.transporter.use(
        'compile',
        hbs({
            viewEngine: {
                partialsDir: path.join(__dirname, 'templates'),
                defaultLayout:false,
            },
            viewPath:path.join(__dirname, 'templates'),
            extName: '.hbs',
        }),
    );
   }

    async sendEmail(body: { to: string; message: string }){
        const qrBase64 = await QRCode.toDataURL(body.message);
        const qrBuffer = Buffer.from(qrBase64.split(',')[1], 'base64');
        await this.transporter.sendMail({
            from: `"Encuestas" <${this.configService.get('MAIL_USER')}>`,
            to: body.to,
            subject: '¡Te invito a realizar una encuesta!',
            template: 'mensaje',
            context: {
                mensaje: body.message,
                qr: 'cid:qrimage'
            },
            attachments: [
            {
                filename: 'qr.png',
                content: qrBuffer,
                cid: 'qrimage'
            }
        ]
        });
    }
}
