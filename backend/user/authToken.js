import jwt from "jsonwebtoken";
import User from "./models/userModel.js";

export function generateAccessToken(userEmailObj, persist = false) {
  return jwt.sign(userEmailObj, process.env.TOKEN_SECRET, {
    expiresIn: persist ? "7d" : "4h",
  });
}

export function authenticateToken(req, res, next) {
  let token = null;
  if (req?.cookies?.auth) {
    token = req.cookies.auth;
  }

  if (!token) {
    const authHeader = req.headers["authorization"];
    token = authHeader && authHeader.split(" ")[1];
  }

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    console.log(err, "user info",user);
    if (err) return res.sendStatus(403);
    req.user = user;
    const dbUser = await User.findById(user.id);
    if (!dbUser.isVerified) return res.sendStatus(403); // Forbidden
    next();
  });
}