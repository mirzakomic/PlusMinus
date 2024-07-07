import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { userRouter } from "./user/routes.js";
import { expensesRouter } from "./user/expensesRouter.js";

const __dirname = path.resolve();

const ReactAppDistPath = path.join(__dirname, '..', 'frontend', 'dist');
const ReactAppIndex = path.join(ReactAppDistPath, 'index.html');

const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.join(__dirname, envPath) });

//* Connect to Database
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.syncIndexes();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;
const baseUrl = process.env.BASE_FE_URL || 'http://localhost:3000';

const corsOptions = {

  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow credentials (cookies) to be sent
};


app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


app.use(express.static(ReactAppDistPath));
// app.use((req, res, next) => {
//   console.log('Request Origin:', req.headers.origin);
//   console.log('Request URL:', req.originalUrl);
//   next();
// });

app.use("/api/user", userRouter);
app.use("/api/expenses", expensesRouter);

app.get("/api/status", (req, res) => {
  res.send({ status: "Ok" });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(ReactAppDistPath, 'index.html')); // Updated path
});


app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port`, PORT);
});