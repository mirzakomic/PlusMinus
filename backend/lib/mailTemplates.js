export const passwordResetMailTemplate = ({ name, resetLink }) => `
Hi ${name || ""},
Please click <a href="${
  resetLink || process.env.RENDER_EXTERNAL_URL
}">here</a> to reset your password.
If you did not try to reset your password, please ignore this mail.
In case you can't click the link, pase the following in the adress bar of your browser: <br>${resetLink}
`;
