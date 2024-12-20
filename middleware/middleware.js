import Product from "../models/product.js";

export const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

export const currentUserProduct = async (req, res, next) => {
  try {
    const { productId } = { ...req.params, ...req.body };
    const product = await Product.findOne({
      _id: productId,
      userId: req.session.userId,
    });
    if (!product) {
      return res.redirect("/admin/products");
    }
    req.product = product;
    next();
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};
