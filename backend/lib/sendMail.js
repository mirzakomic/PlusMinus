import { default as FormData } from 'form-data';
import path from "path";
import Mailgun from "mailgun.js";
import dotenv from "dotenv"

const mailgun = new Mailgun(FormData);
const __dirname = path.resolve();
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.join(__dirname, envPath) });

const mg = mailgun.client({
  key: process.env.MAILGUN_SENDING_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  username: 'api'
});

// Default options for sending email
const defaultOptions = {
  to: ["user@plusminus.onrender.com"], // Default recipient (adjust or remove as needed)
  subject: "Hello",
  html: "<h1>Testing some Mailgun awesomeness!</h1>",
};

// Mailgun client cache

export const sendMail = async ({ to, subject, html } = defaultOptions) => {
  try {
    const message = {
      from: 'Mailgun Sandbox <postmaster@sandbox94b8b558c0274ec0bce2159e5f7f1c15.mailgun.org>',
      to: to,
      subject: subject,
      html: html,
    }
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, message);
    console.log('Mail sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending mail:', error);
    throw new Error('Failed to send email'); // You might want to throw a custom error or handle it as needed
  }
};