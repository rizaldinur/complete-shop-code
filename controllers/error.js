export const get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const get500 = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Internal Failure",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
