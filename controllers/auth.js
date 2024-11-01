import User from "../models/user.js";
import { saveSession } from "../util/helper.js";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import { config } from "dotenv";
import crypto from "crypto";
import { validationResult } from "express-validator";

config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const getLogin = (req, res, next) => {
  const errorMessage = req.flash("error")[0];

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: errorMessage,
  });
};

export const getReset = (req, res, next) => {
  const errorMessage = req.flash("error")[0];

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: errorMessage,
  });
};

export const getSignup = (req, res, next) => {
  const errorMessage = req.flash("error")[0];
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: errorMessage,
  });
};

export const getNewPassword = async (req, res, next) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return res.redirect("/");
  }

  const errorMessage = req.flash("error")[0];
  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "Update Password",
    errorMessage: errorMessage,
    userId: user._id.toString(),
    passwordToken: token,
  });
};

export const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());

    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    email: email,
    password: hashedPassword,
    cart: { items: [] },
  });
  await newUser.save();
  const msg = {
    to: email,
    from: "05111940000201@student.its.ac.id",
    subject: "Singup Successful!",
    html: "<h1>You successfully signed up!</h1>",
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }

  req.session.isLoggedIn = true;
  req.session.userId = newUser._id;
  await saveSession(req);
  res.redirect("/");
};

export const postLogin = async (req, res, next) => {
  // store user data if input matching when log in
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  // console.log(user);
  if (!user) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }

  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }
  req.session.isLoggedIn = true;
  req.session.userId = user._id;
  await saveSession(req);
  res.redirect("/");
};

export const postReset = async (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "No account with that email.");
      return res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    const msg = {
      to: user.email,
      from: "05111940000201@student.its.ac.id",
      subject: "Password Reset",
      html: `
      <p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password<p>
      `,
    };

    try {
      await sgMail.send(msg);
      res.redirect("/");
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  });
};

export const postNewPassword = async (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  const user = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });
  if (!user) {
    return res.redirect("/");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiration = null;
  await user.save();
  console.log("Successfully changed password.");
  res.redirect("/login");
};

export const postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};
