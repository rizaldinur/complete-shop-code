import mongoose from "mongoose";
import Product from "./product.js";
import Order from "./order.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  const cartProduct = this.cart.items.find((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let updatedCart = {};
  // if product exist, add quantity only
  if (cartProduct) {
    const newQuantity = cartProduct.quantity + 1;
    this.cart.items[cartProductIndex].quantity = newQuantity;
    updatedCart = { items: [...this.cart.items] };
  }
  // else,
  else {
    const newProduct = { productId: product._id, quantity: 1 };
    updatedCart = { items: [...this.cart.items, newProduct] };
  }
  console.log(updatedCart);

  this.cart = updatedCart;
  return await this.save();
};

userSchema.methods.deleteCartItem = async function (productId) {
  // get filtered cartitems that doesnt include removed prod id
  const newCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  this.cart.items = newCartItems;
  return await this.save();
};

userSchema.methods.addOrder = async function () {
  const items = await this.populate("cart.items.productId");

  const order = new Order({
    user: this,
  });

  let orderItems = items.cart.items.map((i) => {
    return {
      product: { ...i.productId._doc },
      quantity: i.quantity,
    };
  });

  order.items = orderItems;
  await order.save();

  this.cart.items = [];
  await this.save();
};

const User = mongoose.model("User", userSchema);
export default User;
