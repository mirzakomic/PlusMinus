import crypto from 'crypto';
import User from './models/userModel.js';
import { generateAccessToken } from './authToken.js';
import mailgun from 'mailgun.js';
import dotenv from "dotenv"
import path from 'path';

const mailgun = new mailgun(FormData);

const __dirname = path.resolve();
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.join(__dirname, envPath) });

const mg = mailgun.client({
  key: process.env.MAILGUN_SENDING_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  username: 'api'
});

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = new User({
      email,
      password,
      name,
      isVerified: false,
      verificationToken,
    });

    await user.save();

    const confirmationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
    const message = {
      from: 'Mailgun Sandbox <postmaster@sandbox94b8b558c0274ec0bce2159e5f7f1c15.mailgun.org>',
      to: email,
      subject: 'Email Confirmation',
      text: `Please confirm your email by clicking the link: ${confirmationLink}`,
      html: `<p>Please confirm your email by clicking the link: <a href="${confirmationLink}">${confirmationLink}</a></p>`,
    };

    await mg.messages.create(process.env.MAILGUN_DOMAIN, message);

    res.status(201).send({ message: 'User registered successfully, please check your email to confirm your account.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;
  
    try {
      const user = await User.findOne({ verificationToken: token });
  
      if (!user) {
        return res.status(400).send({ error: 'Invalid or expired token' });
      }
  
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
  
      res.send({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  };