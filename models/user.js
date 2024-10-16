import { ObjectId } from "mongodb";
import { getDB } from "../util/dbconfig.js";

class User {
  constructor(name, email, cart, id) {
    this._id = id;
    this.name = name;
    this.email = email;
    this.cart = cart; //{items: []}
  }

  async save() {
    const db = getDB();
    const result = await db.collection("users").insertOne(this);
    return result;
  }
  static async findById(userId) {
    const db = getDB();
    const result = await db
      .collection("users")
      .findOne({ _id: ObjectId.createFromHexString(userId) });
    return result;
  }

  async addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    const cartProduct = this.cart.items.find((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    const db = getDB();

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

    const result = await db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    return result;
  }

  async getCart() {
    const db = getDB();
    const productIds = this.cart.items.map((cp) => cp.productId);
    console.log(productIds);

    let result = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();
    result = result.map((p, index) => {
      return { ...p, quantity: this.cart.items[index].quantity };
    });
    return result;
  }
}
export default User;
