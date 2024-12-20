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
    validationErrors: [],
    oldInput: null,
  });
};

export const getReset = (req, res, next) => {
  const errorMessage = req.flash("error")[0] || req.flash("success")[0];

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
    oldInput: null,
    validationErrors: [],
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
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
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
    error.httpStatusCode = 500;
    next(error);
  }

  req.session.isLoggedIn = true;
  req.session.userId = newUser._id;
  await saveSession(req);
  res.redirect("/");
};

export const postLogin = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    console.log(result.array());

    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: result.array()[0].msg,
      validationErrors: result.array(),
      oldInput: {
        ...req.body,
      },
    });
  }

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
      req.flash("success", "Password reset link sent to email.");
      res.redirect("/reset");
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
      error.httpStatusCode = 500;
      next(error);
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
