import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async ({ to, subject, text, user }) => {
  const verificationLink = `${process.env.FRONTEND_BASE_URL || 'http://localhost:3001'}?token=${user.verificationToken}`;
  const emailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text: `${text}\n\nPlease verify your email by clicking on the following link: ${verificationLink}`,
  };

  try {
    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;