import { where } from "sequelize";
// import Product from "../models/product.js";
import express from "express";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: false,
  });
};

export const postAddProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const product = new Product(
      title,
      price,
      description,
      imageUrl,
      null,
      req.user._id
    );
    const result = await product.save();
    console.log(result);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/404");
  }
};

export const getEditProduct = async (req, res, next) => {
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
  });
};

export const postEditProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { title, price, description, imageUrl } = req.body;
  const product = new Product(title, price, description, imageUrl, productId);
  const result = await product.save();
  console.log(result);

  res.redirect("/");
};

export const getAdminProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Product",
    path: "/admin/products",
  });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  const result = await Product.deleteById(productId);
  console.log(result);

  res.redirect("/admin/products");
};
