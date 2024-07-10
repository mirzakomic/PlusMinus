import { Router } from "express";
import path from "path";
import multer from "multer";
import crypto from 'crypto';
import { default as FormData } from 'form-data';
import Mailgun from "mailgun.js";
import User from "./models/userModel.js";
import Expense from './models/expenseModel.js';
import Subscription from './models/subscriptionModel.js';
import Goal from './models/goalModel.js';
import { authenticateToken, generateAccessToken } from "./authToken.js";
import { createResetToken, validateResetToken } from "./models/resetTokenModel.js";
import dotenv from "dotenv"
import cors from "cors";

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
// };

// app.use(cors(corsOptions));

const __dirname = path.resolve();
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.join(__dirname, envPath) });

export const userRouter = Router();

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_SENDING_KEY});

const multerMiddleware = multer();

const hoursInMillisec = (hours) => {
  return 1000 * 60 * 60 * hours;
};

userRouter.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

console.log(`Mailgun domain: ${process.env.MAILGUN_DOMAIN}`);


//! Route request a password reset
userRouter.post('/resetPassword', async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Reset password for ', email);
    await createResetToken(email);
    console.log("token was created?" );
    return res.sendStatus(200);
  } catch (e) {
    if (e.message === 'No User with this email') {
      return res.status(404).send({ error: 'User not found' });
    }

    return res.status(500).send({ error: 'Unknown Error occurred' });
  }
});

//! Route confirm password reset
userRouter.post('/resetPassword-confirm', async (req, res) => {
  const { id, token, password } = req.body;

  try {
    const isValidResetProcess = await validateResetToken(id, token);

    if (!isValidResetProcess) {
      return res.status(400).send({ error: 'Invalid or expired reset token' });
    }

    const user = await User.findById(id);
    user.setPassword(password);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();
    return res.send({ message: 'New password confirmed' });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: 'Something went wrong' });
  }
});


//! Helper function to handle registration logic SIGN UP AND VERIFY
const handleRegistration = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      name,
      email,
      password,
      isVerified: false,
      verificationToken,
    });

    newUser.setPassword(password);

    await newUser.save();

    const confirmationLink = `${process.env.BASE_FE_URL}/verify-email?token=${verificationToken}`;
    const message = {
      from: 'Mailgun Sandbox <postmaster@sandbox94b8b558c0274ec0bce2159e5f7f1c15.mailgun.org>',
      to: email,
      subject: 'Email Confirmation',
      text: `Please confirm your email by clicking the link: ${confirmationLink}`,
      html: `<p>Please confirm your email by clicking the link: <a href="${confirmationLink}">${confirmationLink}</a></p>`,
    };

    await mg.messages.create(process.env.MAILGUN_DOMAIN, message);

    res.status(201).send({
      message: 'User registered successfully, please check your email to confirm your account.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

//* Helper function to handle email verification logic
const handleEmailVerification = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send({ error: 'Invalid or expired token' });
    } else {
      user.isVerified = true;
      // user.verificationToken = undefined;
      await user.save();
      res.send({ message: 'Email verified successfully' });
    }
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
};

//! Route definitions SIGN UP
userRouter.post('/signup', multerMiddleware.none(), handleRegistration);
userRouter.get('/verify-email', handleEmailVerification);

//! Login
userRouter.post("/login", multerMiddleware.none(), async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt with email:', email);
  const user = await User.findOne({ email }).select("+hash").select("+salt").select("+name");
  
  // Check if user exists and password is valid
  if (!user || !user.verifyPassword(password)) {
    console.log('Login failed: Invalid credentials');
    return res.status(404).send({
      message: "Failed to login",
      error: {
        message: "Wrong username and password combo.",
      },
    });
  }

  // If user exists and password is valid, generate access token
  const token = generateAccessToken({ email, name: user.name, id:user.id });
  console.log(token);

  // New approach for cookie saving
  res.cookie("auth", token, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
    maxAge: hoursInMillisec(4),
  });

  // Send the user data back to the client, including the name and id
  res.send({ message: "Success", data: { ...user.toObject(), name: user.name, id: user.id } });
});

//! Logout
userRouter.get("/logout", (req, res) => {
  res.clearCookie("auth", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.send("OK");
  console.log("logout backend");
});

//! Authorization of user
userRouter.get("/secure", authenticateToken, async (req, res) => {
  try {
    const { email, name, id, token } = req.user; 
    console.log("secure trying", email, name, id);
    if (!email || !name) {
      return res.status(400).send({ error: "Invalid token payload" });
    }
    res.send({ email, name, id, token });
  } catch (error) {
    console.error("secure throws an error",error);
    res.status(500).send({ error: "Internal server error" });
  }
});

userRouter.get('/customcategoryfetch', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.send({ customCategories: user.customCategories });
  } catch (error) {
    console.error("Error fetching custom categories", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

userRouter.post('/customcategory', authenticateToken, async (req, res) => {
  try {
    const { userId, category } = req.body;
    const user = await User.findById(userId);
    console.log('Received request to add custom category:', { userId, category });
    if (user.customCategories.includes(category)) {
      return res.status(400).send('Category already exists.');
    }
    user.customCategories.push(category);
    await user.save();
    res.status(201).send(user.customCategories);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

userRouter.put('/income', authenticateToken, async (req, res) => {
  const { monthlyIncome } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.monthlyIncome = monthlyIncome;
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update monthly income' });
  }
});

userRouter.get('/incomefetch', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ monthlyIncomeValue: user.monthlyIncome });
  } catch (error) {
    console.error('Error fetching monthly income:', error); // Optional: Log error for debugging
    res.status(500).send({ error: 'Failed to fetch monthly income' });
  }
});

userRouter.post('/setbalance', authenticateToken, async (req, res) => {
  const { balance, monthlyIncome } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    user.balance = balance;
    user.monthlyIncome = monthlyIncome;
    await user.save();

    res.status(200).send({ balance: user.balance, monthlyIncome: user.monthlyIncome });
  } catch (error) {
    res.status(500).send({ error: 'Failed to set balance and monthly income' });
  }
});