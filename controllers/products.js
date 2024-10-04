import Product from "../models/Product.js";

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
  Product.fetchAll().then((products) => {
    console.log(products);
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};
