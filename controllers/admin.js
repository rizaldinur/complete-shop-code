import { where } from "sequelize";
import Product from "../models/product.js";
import express from "express";
import User from "../models/user.js";

export const getAddProduct = (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editMode: false,
      isAuthenticated: req.session.isLoggedIn,
    });
  } else {
    res.redirect("/login");
  }
};

export const postAddProduct = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      const user = await User.findById(req.session.userId);
      const product = new Product({ ...req.body, userId: user });
      const result = await product.save();
      console.log(result);

      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.redirect("/404");
    }
  } else {
    res.redirect("/login");
  }
};

export const getEditProduct = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const editMode = req.query.edit;

    if (!editMode) {
      return res.redirect("/404");
    }
    const { productId } = req.params;
    const product = await Product.findById(productId);

    res.render("admin/edit-product", {
      product: product,
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editMode: editMode,
      isAuthenticated: req.session.isLoggedIn,
    });
  } else {
    res.redirect("/login");
  }
};

export const postEditProduct = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    product.set(req.body);
    const result = await product.save();
    console.log(result);

    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};

export const getAdminProducts = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    // test using cursor
    const cursor = Product.find().cursor();
    let products = [];
    for await (const doc of cursor) {
      products = [...products, doc];
    }

    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Product",
      path: "/admin/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } else {
    res.redirect("/login");
  }
};

export const deleteProduct = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const { productId } = req.body;
    const result = await Product.findByIdAndDelete(productId);
    console.log(result);

    res.redirect("/admin/products");
  } else {
    res.redirect("/login");
  }
};
