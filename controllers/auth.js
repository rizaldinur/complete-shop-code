export const getLogin = (req, res, next) => {
  const isLoggedIn = req.get("Cookie").split("=")[1].trim();

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

export const postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
