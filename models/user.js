import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
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

const User = mongoose.model("User", userSchema);
export default User;

// class User {
//   constructor(name, email, cart, id) {
//     this._id = id;
//     this.name = name;
//     this.email = email;
//     this.cart = cart; //{items: []}
//   }

//   async save() {
//     const db = getDB();
//     const result = await db.collection("users").insertOne(this);
//     return result;
//   }
//   static async findById(userId) {
//     const db = getDB();
//     const result = await db
//       .collection("users")
//       .findOne({ _id: ObjectId.createFromHexString(userId) });
//     return result;
//   }

//   async addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     const cartProduct = this.cart.items.find((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     const db = getDB();

//     let updatedCart = {};
//     // if product exist, add quantity only
//     if (cartProduct) {
//       const newQuantity = cartProduct.quantity + 1;
//       this.cart.items[cartProductIndex].quantity = newQuantity;
//       updatedCart = { items: [...this.cart.items] };
//     }
//     // else,
//     else {
//       const newProduct = { productId: product._id, quantity: 1 };
//       updatedCart = { items: [...this.cart.items, newProduct] };
//     }

//     const result = await db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//     return result;
//   }

//   async getCart() {
//     const db = getDB();
//     const productIds = this.cart.items.map((cp) => cp.productId);
//     let cartItems = this.cart.items;
//     // console.log("Current user cart items ", cartItems);

//     let result = await db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray();
//     // console.log("Found matching products", result);

//     //check if some cart item does not exist in products collection
//     //update user cart items to match that exist
//     cartItems = cartItems.filter((item) => {
//       // check each item id if exist in products, then return the matching
//       return result.some((r) => r._id.equals(item.productId));
//     });
//     // console.log("Updated cart items ", cartItems);
//     await db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } });

//     const displayItems = cartItems.map((p) => {
//       return {
//         ...result.find((r) => r._id.toString() === p.productId.toString()),
//         quantity: p.quantity,
//       };
//     });
//     // console.log("Items to display ", displayItems);
//     return displayItems;
//   }

//   async deleteCartItem(productId) {
//     // get filtered cartitems that doesnt include removed prod id
//     const newCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId
//     );
//     console.log(newCartItems);
//     const newCart = { items: newCartItems };
//     console.log(newCart);

//     const db = getDB();
//     const result = await db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: newCart } });
//     return result;
//   }

//   async addOrder() {
//     const db = getDB();
//     const products = await this.getCart();
//     const order = {
//       items: products,
//       user: { _id: this._id, name: this.name },
//     };
//     await db.collection("orders").insertOne(order);
//     this.cart = { items: [] };
//     await db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//   }

//   async getOrder() {
//     const db = getDB();

//     const result = await db
//       .collection("orders")
//       .find({ "user._id": this._id })
//       .toArray();

//     return result;
//   }
// }

// export default User;
