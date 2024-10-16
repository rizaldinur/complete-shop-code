import { ObjectId } from "mongodb";
import { getDB } from "../util/dbconfig.js";

class Product {
  constructor(title, price, description, imageUrl, id) {
    this._id = id ? ObjectId.createFromHexString(id) : null;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  async save() {
    const db = getDB();
    let { _id, ...newDocument } = this;

    let result;
    if (this._id) {
      result = await db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: newDocument });
    } else {
      result = await db.collection("products").insertOne(newDocument);
    }

    return result;
  }

  static async fetchAll() {
    const db = getDB();
    const result = await db.collection("products").find({}).toArray();
    return result;
  }

  static async findById(id) {
    const db = getDB();

    const result = await db
      .collection("products")
      .findOne({ _id: ObjectId.createFromHexString(id) });
    return result;
  }

  static async deleteById(id) {
    const db = getDB();
    const result = await db
      .collection("products")
      .deleteOne({ _id: ObjectId.createFromHexString(id) });
    return result;
  }
}

export default Product;
