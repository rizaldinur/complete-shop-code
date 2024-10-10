import Product from "../models/product.js";
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
    // const { title, imageUrl, price, description } = req.body;
    await Product.create({ ...req.body });
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
  const product = await Product.findByPk(productId);

  res.render("admin/edit-product", {
    product: product,
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editMode: editMode,
  });
};

export const postEditProduct = async (req, res, next) => {
  const { productId } = req.params;
  const [count, rows] = await Product.update(
    {
      ...req.body,
    },
    {
      where: {
        id: productId,
      },
    }
  );
  console.log(count);
  console.log(rows);

  res.redirect("/");
};
export const getAdminProducts = async (req, res, next) => {
  const products = await Product.findAll();

  res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Product",
    path: "/admin/products",
  });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await Product.destroy({ where: { id: productId } });
  res.redirect("/admin/products");
};
