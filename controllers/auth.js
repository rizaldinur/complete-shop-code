import User from "../models/user.js";
import { saveSession } from "../util/helper.js";
import bcrypt from "bcryptjs";

export const getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn, req.session.userId);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    return res.redirect("/signup");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    email: email,
    password: hashedPassword,
    cart: { items: [] },
  });
  await newUser.save();
  req.session.isLoggedIn = true;
  req.session.userId = newUser._id;
  await saveSession(req);
  res.redirect("/");
};

export const postLogin = async (req, res, next) => {
  // store user data if input matching when log in
  const { email, password } = req.body;
  const user = await User.findOne({ email: email, password: password });

  console.log(user);
  if (user) {
    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    await saveSession(req);
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};
export const postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};
