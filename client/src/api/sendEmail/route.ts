// src/app/api/sendEmail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Создаем транспорт с параметрами SMTP от TimeWeb
const transporter = nodemailer.createTransport({
  host: 'smtp.timeweb.ru', // SMTP-хост TimeWeb
  port: 25, // Порт SMTP (или 465 для SSL)
  secure: false, // Установите `true`, если используете SSL
  auth: {
    user: process.env.EMAIL_USER, // Ваш почтовый ящик
    pass: process.env.EMAIL_PASS, // Ваш пароль
  },
});

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json();

    const mailOptions = {
      from: process.env.EMAIL_USER, // Отправитель
      to: process.env.RECIPIENT_EMAIL, // Получатель
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nPhone: ${phone}`,
    };

    await transporter.sendMail(mailOptions);
    return new NextResponse(
      JSON.stringify({ message: 'Email sent successfully!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
