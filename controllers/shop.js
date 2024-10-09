import Product from "../models/product.js";
import Cart from "../models/cart.js";

export const getProducts = async (req, res, next) => {
  try {
    const result = await Product.fetchAll();
    const products = result.rows;
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    res.redirect("/404");
    console.error(error);
  }
};

export const getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  res.render("shop/product-detail", {
    product: product,
    pageTitle: product.title,
    path: "/products",
  });
};

export const getIndex = async (req, res, next) => {
  const result = await Product.fetchAll();
  const products = result.rows;

  res.render("shop/index", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
  });
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.getCart();
    const products = await Product.fetchAll();

    let cartDetails = { products: [], totalPrice: cart.totalPrice };
    products.forEach((prod) => {
      cart.products.forEach((cprod) => {
        if (prod.id === cprod.id) {
          cartDetails.products.push({
            ...prod,
            qty: cprod.qty,
          });
        }
      });
    });

    console.log(cartDetails);
    res.render("shop/cart", {
      products: cartDetails.products,
      totalPrice: cartDetails.totalPrice,
      path: "/cart",
      pageTitle: "Your Cart",
    });
  } catch (error) {
    console.log(error);
    res.redirect("/404");
  }
};

export const postCart = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  const productPrice = product.price;
  await Cart.addProduct(productId, productPrice);

  res.redirect("/cart");
};

export const postDeleteCartItem = async (req, res, next) => {
  const { productId, productSubTotal } = req.body;
  await Cart.deleteProduct(productId, productSubTotal);

  res.redirect("/cart");
};

export const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Cart",
  });
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
