import nodemailer from 'nodemailer'
import config from './config.util'

export async function sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: config.NODEMAILER_EMAIL,
            pass: config.NODEMAILER_PASSWORD,
        },
    })
    await transporter.sendMail({
        from: config.NODEMAILER_EMAIL,
        to,
        subject,
        text,
        html,
    })
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
