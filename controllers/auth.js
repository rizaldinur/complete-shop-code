import User from "../models/user.js";

export const getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn, req.session.userId);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const postLogin = async (req, res, next) => {
  // store user data if input matching when log in
  const email = req.body.email;
  let user;
  if (!email) {
    user = await User.findById("6711e33c8dde4e1c73e5389a");
  } else {
    user = await User.findOne({ email: email });
  }
  console.log(user);
  if (user) {
    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    await req.session.save();
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};
export const postLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
};
