import crypto from "crypto";
import { Schema, model } from "mongoose";
import User from "./userModel.js";
import { passwordResetMailTemplate } from "../../lib/mailTemplates.js";
import { sendMail } from "../../lib/sendMail.js";

// Define the ResetToken schema
const resetTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 7200,
  },
});

export const ResetToken = model("ResetToken", resetTokenSchema);

// Function to create a reset token
export const createResetToken = async (userEmail) => {
  console.log(`Attempting to create reset token for email: ${userEmail}`);

  // Check if user exists
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    console.error("Error: No user found with this email");
    throw new Error("No User with this email");
  }

  // Log the user details
  console.log(`User found: ${user.id}`);

  // If token is already present, delete it
  let token = await ResetToken.findOne({ userId: user.id });
  if (token) {
    console.log(`Existing reset token found for user ${user.id}, deleting it.`);
    await token.deleteOne();
  }

  const resetToken = crypto.randomBytes(64).toString("hex");
  console.log(`Generated reset token: ${resetToken}`);

  await ResetToken.create({
    userId: user.id,
    token: resetToken,
    createdAt: Date.now(),
  });

  console.log(`Reset token saved to database for user ${user.id}`);

  // URL for the password reset link
  const clientURL = process.env.RENDER_EXTERNAL_URL;
  const resetURL = new URL(
    `/passwordReset?token=${resetToken}&id=${user.id}`,
    clientURL
  );
  console.log(`Password reset URL: ${resetURL}`);

  // Create Email template
  const mailHTML = passwordResetMailTemplate({
    name: user.name,
    resetLink: resetURL,
  });

  console.log(`Sending password reset email to ${user.email}`);
  await sendMail({
    to: [user.email],
    subject: `${process.env.APP_NAME} Password Reset!`,
    html: mailHTML,
  });

  console.log('Password reset email sent successfully');
};

export const validateResetToken = async (userId, resetToken) => {
  console.log(`Validating reset token for user ${userId}`);

  const passwordResetToken = await ResetToken.findOne({ userId }).populate(
    "userId"
  );

  if (!passwordResetToken) {
    console.error(`No reset token found for user ${userId}`);
    throw new Error("Token expired");
  }

  console.log(`Token found: ${passwordResetToken.token}`);
  const isValid = resetToken === passwordResetToken.token;
  console.log(`Reset token validation result: ${isValid}`);

  return isValid;
};