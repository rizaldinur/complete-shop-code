import { where } from "sequelize";
import Product from "../models/product.js";
import express from "express";
import User from "../models/user.js";
import { isValidURL } from "../util/helper.js";
import { validationResult } from "express-validator";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: false,
    product: null,
    errorMessage: null,
    validationErrors: [],
    oldInput: null,
  });
};

export const postAddProduct = async (req, res, next) => {
  try {
    const resultValidate = validationResult(req);

    if (!resultValidate.isEmpty()) {
      console.log(resultValidate.array());

      return res.status(422).render("admin/edit-product", {
        path: "/admin/add-product",
        pageTitle: "Add Product",
        editMode: false,
        product: null,
        errorMessage: resultValidate
          .array()
          .map((e) => e.msg)
          .toString()
          .replaceAll(",", " "),
        validationErrors: resultValidate.array(),
        oldInput: {
          ...req.body,
        },
      });
    }

    const product = new Product({
      ...req.body,
      userId: req.session.userId,
    });
    const result = await product.save();
    console.log(result);

    res.redirect("/");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

export const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/404");
  }

  res.render("admin/edit-product", {
    product: req.product,
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editMode: editMode,
    errorMessage: null,
    validationErrors: [],
    oldInput: null,
  });
};

export const postEditProduct = async (req, res, next) => {
  const resultValidate = validationResult(req);

  if (!resultValidate.isEmpty()) {
    console.log(resultValidate.array());

    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Add Product",
      editMode: req.query.edit,
      product: null,
      errorMessage: resultValidate.array()[0].msg,
      validationErrors: resultValidate.array(),
      oldInput: { _id: req.product._id, ...req.body },
    });
  }
  req.product.set(req.body);
  const result = await req.product.save();
  console.log(result);

  res.redirect("/");
};

export const getAdminProducts = async (req, res, next) => {
  // test using cursor
  try {
    const cursor = Product.find({ userId: req.session.userId }).cursor();
    let products = [];
    for await (const doc of cursor) {
      products = [...products, doc];
    }
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Product",
      path: "/admin/products",
    });
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.product);
    res.redirect("/admin/products");
  } catch (error) {
    error.httpStatusCode = 500;
    console.error(error);
    next(error);
  }
};
