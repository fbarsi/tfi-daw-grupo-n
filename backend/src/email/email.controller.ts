import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(
        private emailService:EmailService
    ){}

    @Post('send')
    async sendEmail(@Body() body: { to: string; message: string }, @Res() res: Response) {
        try {
            const response = await this.emailService.sendEmail(body);
            res.status(HttpStatus.OK).send(response);
        } catch (error) {
            throw error;
        }
    }
}
