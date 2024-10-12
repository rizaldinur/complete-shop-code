import { ObjectId } from "mongodb";
import { getDB } from "../util/dbconfig.js";

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  async save() {
    const db = getDB();
    const result = await db.collection("products").insertOne(this);
    console.log(result);
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
}

export default Product;
