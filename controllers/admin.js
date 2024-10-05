import Product from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

export const postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, price, description);
  await product.save();
  res.redirect("/");
};

export const getAdminProducts = (req, res, next) => {
  res.render("admin/products", {
    pageTitle: "Admin Product",
    path: "/admin/products",
  });
};
