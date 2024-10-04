import Product from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

export const postAddProduct = async (req, res, next) => {
  const product = new Product(req.body.title);
  await product.save();
  res.redirect("/");
};

export const getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  console.log(products);

  res.render("shop/product-list", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};
