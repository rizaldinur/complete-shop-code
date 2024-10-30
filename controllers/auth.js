import User from "../models/user.js";
import { saveSession } from "../util/helper.js";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import { config } from "dotenv";

config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const getLogin = (req, res, next) => {
  // console.log(req.session.isLoggedIn, req.session.userId);
  const errorMessage = req.flash("error")[0];
  console.log(errorMessage);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: errorMessage,
  });
};

export const getSignup = (req, res, next) => {
  const errorMessage = req.flash("error")[0];
  console.log(errorMessage);
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: errorMessage,
  });
};

export const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    req.flash("error", "E-mail already exists, please enter a different one.");
    return res.redirect("/signup");
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
export const postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};
