import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
    service:'gmail',
      secure: false,
      auth: {
        user: 'optiflow464@gmail.com', 
        pass: 'pjvj zjhv hdvd nuzw ',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const message = {
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(message);
      console.log('E-mail envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail', error);
      throw new Error('Erreur lors de l\'envoi de l\'e-mail');
    }
  }
}