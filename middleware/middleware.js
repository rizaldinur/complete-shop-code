import Product from "../models/product.js";

export const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

export const isProductCreator = async (req, res, next) => {
  const { productId } = { ...req.params, ...req.body };

  const product = await Product.findOne({
    _id: productId,
    userId: req.session.userId,
  });
  if (!product) {
    return res.redirect("/admin/products");
  }
  req.productId = product._id;
  next();
};
