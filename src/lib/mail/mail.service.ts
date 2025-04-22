import nodemailer, { createTransport } from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { envConfig } from '../../config/env.config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = createTransport({
      host: envConfig.mail_host,
      port: envConfig.mail_port,
      secure: false,
      // secure: envConfig.mail_port === 465,
      auth: {
        user: envConfig.mail_user,
        pass: envConfig.mail_password,
      },
    } as unknown as nodemailer.Transporter);
  }

  async send({
    to,
    subject,
    html,
    shop_name,
    attachments,
  }: {
    to: string;
    subject: string;
    html: string;
    shop_name?: string;
    attachments?: { filename: string; path: string }[];
  }) {
    try {
      const result = await this.transporter.sendMail({
        from: `${shop_name || envConfig.application_name} <${envConfig.mail_user}>`,
        to,
        subject,
        html,
        attachments: attachments || [],
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    } catch (error) {
      throw new InternalServerErrorException(String(error));
    }
  }
}
