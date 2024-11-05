import mongoose from "mongoose";
import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import fs from "fs/promises";
import path from "path";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
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
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
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
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const postCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.session.userId);
    const product = await Product.findById(productId);
    const result = await user.addToCart(product);
    console.log(result.cart.items);

    res.redirect("/cart");
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const postDeleteCartItem = async (req, res, next) => {
  try {
    const { productId, productSubTotal } = req.body;
    const user = await User.findById(req.session.userId);
    await user.deleteCartItem(productId);

    res.redirect("/cart");
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const postOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    await user.addOrder();
    res.redirect("/orders");
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const userOrders = await Order.find({ user: req.session.userId });

    res.render("shop/orders", {
      path: "/orders",
      orders: userOrders,
      pageTitle: "Your Orders",
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const getInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      _id: orderId,
      user: req.session.userId,
    });
    if (!order) {
      return res.redirect("/orders");
    }
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);
    const data = await fs.readFile(invoicePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + invoiceName + '"'
    );
    res.send(data);
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const getCheckout = (req, res, next) => {
  try {
    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};
