import crypto from "crypto";
import e from "express";
import { Schema, model } from "mongoose";

const isEmail = (string) => {
  const [name, domainWithTLD, ...rest] = string.split("@");
  if (rest.length || !name || !domainWithTLD) {
    return false;
  }

  const [domain, tld] = domainWithTLD.split(".");
  if (tld.length < 2 || !domain) return false;

  return true;
};

export const userSchema = new Schema({
  name: { type: String, required: [true, "Please specify your name"] },
  email: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    validate: {
      validator: isEmail,
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  salt: { type: String, required: true, select: false },
  hash: { type: String, required: true, select: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  customCategories: { type: [String], default: [] },
  initialBalance: { type: Number, default: 0 },
  monthlyIncome: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
});

userSchema.methods.setPassword = function (password) {
  //Salt
  this.salt = crypto.randomBytes(64).toString("hex");

  // Password mit salt hashen
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.verifyPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");

  return this.hash === hash;
};

export const User = model("User", userSchema);

export default User;
