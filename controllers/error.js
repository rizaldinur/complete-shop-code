const pageNotFound = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: "",
      isAuthenticated: false,
    });
};

export default pageNotFound;
