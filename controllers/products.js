import Product from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

export const postAddProduct = (req, res, next) => {
  const products = new Product(req.body.title);
  products.save();
  res.redirect("/");
};

export const getProducts = (req, res, next) => {
  const product = Product.fetchAll();
  res.render("shop", {
    prods: product,
    pageTitle: "Shop",
    path: "/",
    hasProducts: product.length > 0,
    activeShop: true,
    productCSS: true,
  });
};
