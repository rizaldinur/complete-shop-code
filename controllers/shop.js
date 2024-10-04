import Product from "../models/product.js";

export const getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  console.log(products);

  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All Products",
    path: "/products",
  });
};

export const getIndex = async (req, res, next) => {
  const products = await Product.fetchAll();
  console.log(products);

  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
};

export const getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
