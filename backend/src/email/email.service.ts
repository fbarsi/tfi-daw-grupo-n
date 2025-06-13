import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as QRCode from 'qrcode';
import { Transporter } from 'nodemailer';
import { response } from 'express';
import { EncuestasService } from 'src/encuestas/encuestas.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Encuestas } from 'src/encuestas/entities/encuestas.entity';
import { Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class EmailService {
  private transporter: Transporter; //clase de nodemailer

  constructor(private readonly configService: ConfigService,
    private readonly encuestaService : EncuestasService
  ) {

    // configuración del transporter con variables de entorno (email y clave de aplicacion)
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  private obtenerTemplate(templateName: string, context: any): string {
    const templatePath = path.join(__dirname, '..', 'public', 'template', `${templateName}.hbs`);
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    return template(context);
  }

  async sendEmail(body: { to: string; message: string }) {

    //config. del QR del correo
    const qrBase64 = await QRCode.toDataURL(body.message); // arma qr con el link que viene desde el front
    const qrCid = 'qrimage';
    const qrBuffer = Buffer.from(qrBase64.split(',')[1], 'base64');

    const codigo = body.message.substring(body.message.lastIndexOf('/') + 1);
    const encuesta = await this.encuestaService.buscarEncuestaPorCodRes(codigo);

    if(!encuesta){
      throw new Error('Encuesta no encontrada');
    }

    // busca la template hbs del correo
    const html = this.obtenerTemplate('mensaje', {
      mensaje: body.message,
      qr: `cid:${qrCid}`,
      encuesta: encuesta
    });

    await this.transporter.sendMail({
      from: `"Encuestas" <${this.configService.get<string>('MAIL_USER')}>`,
      to: body.to,
      subject: '¡Te invito a realizar una encuesta!',
      html,
      attachments: [
        {
          filename: 'qr.png',
          content: qrBuffer,
          cid: qrCid,
        },
      ],
    });

    return { success: true, message: 'Correo enviado exitosamente.' };
  }
}
