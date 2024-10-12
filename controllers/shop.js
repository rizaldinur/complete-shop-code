import Product from "../models/product.js";
// import Cart from "../models/cart.js";
// import { Model, where } from "sequelize";
// import CartItem from "../models/cart-item.js";
// import Order from "../models/order.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    console.log(products);

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
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    console.log(product);

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (error) {
    res.redirect("/404");
    console.error(error);
  }
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

export const getCart = async (req, res, next) => {
  try {
    const userCart = await req.user.getCart();

    //get products in CartItem associated with current Cart instance
    const products = await userCart.getProducts();

    res.render("shop/cart", {
      products: products,
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
  let newQty = 1;
  //get current user Cart instance
  const userCart = await req.user.getCart();

  //get products in CartItem associated with current Cart instance
  //with the product Id
  const products = await userCart.getProducts({
    where: { id: productId },
  });
  let product;
  //if product already exists in CartItem, update newQty
  if (products.length > 0) {
    product = products[0];
    let oldQty = product.cartItem.quantity;
    console.log(oldQty);
    newQty = oldQty + 1;
  } else {
    const newProd = await Product.findByPk(productId);
    product = newProd;
  }

  await userCart.addProduct(product, {
    through: { quantity: parseInt(newQty) },
  });
  res.redirect("/cart");
};

export const postDeleteCartItem = async (req, res, next) => {
  const { productId, productSubTotal } = req.body;
  const userCart = await req.user.getCart();
  const product = await userCart.getProducts({ where: { id: productId } });
  await userCart.removeProduct(product[0]);

  res.redirect("/cart");
};

export const postOrder = async (req, res, next) => {
  const userCart = await req.user.getCart();
  const products = await userCart.getProducts();

  const userOrder = await req.user.createOrder();
  await userOrder.addProducts(
    products.map((p) => {
      p.orderItem = { quantity: p.cartItem.quantity };
      return p;
    })
  );
  await userCart.setProducts([]);

  res.redirect("/orders");
};

export const getOrders = async (req, res, next) => {
  const userOrders = await req.user.getOrders({ include: Product });
  // const userOrders = await Order.findAll({
  //   where: { userId: req.user.id },
  //   include: Product,
  // });

  res.render("shop/orders", {
    path: "/orders",
    orders: userOrders,
    pageTitle: "Your Orders",
  });
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
