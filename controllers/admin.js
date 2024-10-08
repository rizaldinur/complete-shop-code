import Product from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: false,
  });
};

export const postAddProduct = async (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, description, price);
  await product.save();
  res.redirect("/");
};

export const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/404");
  }
  const { productId } = req.params;
  const product = await Product.findById(productId);
  console.log(product);

  res.render("admin/edit-product", {
    product: product,
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editMode: editMode,
  });
};

export const getAdminProducts = async (req, res, next) => {
  const products = await Product.fetchAll();

  res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Product",
    path: "/admin/products",
  });
};
