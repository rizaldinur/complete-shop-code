import mongoose from "mongoose";
import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "../models/order.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (error) {
    res.redirect("/404");
    console.error(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (error) {
    res.redirect("/404");
    console.error(error);
  }
};

export const getIndex = async (req, res, next) => {
  const products = await Product.find();

  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).populate(
      "cart.items.productId",
      "title"
    );

    //update if theres non existent product
    const hasNull = user.cart.items.some((item) => item.productId === null);
    if (hasNull) {
      user.cart.items = user.cart.items.filter(
        (item) => item.productId !== null
      );
      await user.save();
    }

    const products = user.cart.items;

    res.render("shop/cart", {
      products: products,
      path: "/cart",
      pageTitle: "Your Cart",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/404");
  }
};

export const postCart = async (req, res, next) => {
  const { productId } = req.body;
  const user = await User.findById(req.session.userId);
  const product = await Product.findById(productId);
  const result = await user.addToCart(product);
  console.log(result.cart.items);

  res.redirect("/cart");
};

export const postDeleteCartItem = async (req, res, next) => {
  const { productId, productSubTotal } = req.body;
  const user = await User.findById(req.session.userId);
  await user.deleteCartItem(productId);

  res.redirect("/cart");
};

export const postOrder = async (req, res, next) => {
  const user = await User.findById(req.session.userId);
  await user.addOrder();
  res.redirect("/orders");
};

export const getOrders = async (req, res, next) => {
  const userOrders = await Order.find({ user: req.session.userId });

  res.render("shop/orders", {
    path: "/orders",
    orders: userOrders,
    pageTitle: "Your Orders",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
