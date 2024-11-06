import mongoose from "mongoose";
import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import midtransClient from "midtrans-client";
import { config } from "dotenv";
import { param } from "express-validator";
import { Types } from "mongoose";
import { saveSession } from "../util/helper.js";

config();
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const ITEMS_PER_PAGE = 1;
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

export const getProducts = async (req, res, next) => {
  try {
    let page = +req.query?.page || 1;
    let limit = +req.query?.limit || ITEMS_PER_PAGE;

    const productCount = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      currentPage: page,
      hasNextPage: limit * page < productCount,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(productCount / limit),
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
    let page = +req.query?.page || 1;
    let limit = +req.query?.limit || ITEMS_PER_PAGE;

    const productCount = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      currentPage: page,
      hasNextPage: limit * page < productCount,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(productCount / limit),
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
    for (const order of userOrders) {
      const res = await snap.transaction.status(order._id);

      if (
        res.transaction_status !== order.transaction.status &&
        res.transaction_status !== "deny"
      ) {
        order.transaction.status = res.transaction_status;
        await order.save();
      }
    }
    const updatedOrders = await Order.find({ user: req.session.userId });

    res.render("shop/orders", {
      path: "/orders",
      orders: updatedOrders,
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

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + invoiceName + '"'
    );
    doc.pipe(createWriteStream(invoicePath)); // write to PDF
    doc.pipe(res); // HTTP response

    // add stuff to PDF here using methods described below...
    doc.fontSize(32).text("Invoice", {
      underline: true,
      continued: true,
      align: "left",
    });

    doc.fontSize(16).text("Order ID: #" + order._id, doc.x, doc.y + 10, {
      underline: false,
      continued: false,
      align: "right",
    });

    let totalPrice = 0;
    doc.moveDown(0.5);
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 1)
      .dash(5)
      .stroke();

    doc.moveDown();
    order.items.forEach((item) => {
      totalPrice += item.quantity * item.product.price;
      doc
        .fontSize(20)
        .text(
          item.product.title +
            " - " +
            item.quantity +
            " x " +
            "IDR " +
            (item.product.price * 1000).toLocaleString("id-ID"),
          {
            continued: true,
            align: "left",
          }
        );

      doc.text(
        (item.quantity * item.product.price * 1000).toLocaleString("id-ID"),
        { continued: false, align: "right" }
      );
    });
    doc.moveDown();
    doc
      .moveTo(doc.page.margins.left, doc.y + 1)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 1)
      .stroke();
    doc.moveDown(0.5);
    doc
      .fontSize(26)
      .text("Total Price:", {
        continued: true,
        align: "left",
      })
      .text("IDR " + (totalPrice * 1000).toLocaleString("id-ID"), {
        continued: false,
        align: "right",
      });

    // finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const getCheckout = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).populate(
      "cart.items.productId"
    );
    let total = 0;
    const products = user.cart.items;
    products.forEach((p) => (total += p.productId.price * p.quantity));
    const items = products.map((p) => {
      return {
        id: p.productId._id,
        name: p.productId.title,
        price: p.productId.price * 1000,
        quantity: p.quantity,
        url: "http://localhost:3000/products/" + p.productId._id,
      };
    });
    // console.log(products);
    // console.log(items);
    console.log(total);
    const orderId = new Types.ObjectId().toString();
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total * 1000,
      },
      credit_card: {
        secure: true,
      },
      item_details: items,
      customer_details: {
        email: user.email,
        billing_address: {
          email: user.email,
          city: "Surabaya",
          country_code: "IDN",
        },
      },
      expiry: {
        unit: "hours",
        duration: 24,
      },
      callbacks: {
        finish: `http://localhost:3000/orders/payment-status`,
        error: `http://localhost:3000/orders/payment-status`,
      },
    };
    parameter = JSON.stringify(parameter);

    const transaction = await snap.createTransaction(parameter);
    console.log(transaction);
    req.session.transactionToken = transaction.token;
    await saveSession(req);

    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
      products: products,
      totalPrice: total,
      clientKey: MIDTRANS_CLIENT_KEY,
      transactionToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const getPaymentStatus = async (req, res, next) => {
  try {
    const { order_id } = req.query;
    let user = {};
    let userOrder = {};
    const response = await snap.transaction.status(order_id);
    console.log(response);
    console.log(
      order_id,
      response.transaction_status,
      response.status_code,
      req.session.transactionToken
    );

    if (response.transaction_status !== "deny") {
      user = await User.findById(req.session.userId);
      userOrder = await user.addOrUpdateOrder(
        order_id,
        response.transaction_status,
        response.status_code,
        req.session.transactionToken
      );
    }
    console.log(user instanceof User, userOrder instanceof Order);

    res.render("shop/payment-status", {
      transactionStatus: userOrder.transaction.status,
      orderId: order_id,
      path: "/orders",
      pageTitle: "Your Order",
      expiryDate: response.expiry_time,
      totalPrice: +response.gross_amount,
      clientKey: MIDTRANS_CLIENT_KEY,
      transactionToken: userOrder.transaction.token,
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};
