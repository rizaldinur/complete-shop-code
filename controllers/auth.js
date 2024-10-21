export const getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split("=")[1].trim();
  console.log(req.session.isLoggedIn);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

export const postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
