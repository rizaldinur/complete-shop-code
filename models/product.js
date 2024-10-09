import rootDir from "../util/path.js";
import path from "path";
import fs from "fs/promises";
import { get } from "http";
import { writeFile } from "fs";
import Cart from "./cart.js";
import db from "../util/dbconfig.js";

const p = path.join(rootDir, "data", "products.json");

const getFileContent = async () => {
  try {
    const fileContent = await fs.readFile(p);
    return JSON.parse(fileContent);
  } catch (error) {
    console.log(error);
    return [];
  }
};

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  async save() {
    if (this.id) {
      const products = await getFileContent();
      //get exising prod
      const existingProductIndex = products.findIndex((p) => p.id === this.id);
      //rewrite products with new updated product data
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = this;
      //rewrite the file product data
      console.log(this);
      await fs.writeFile(p, JSON.stringify(updatedProducts));
    } else {
      this.id = Math.random().toString();
      const products = await getFileContent();
      console.log(this);
      products.push(this);
      await fs.writeFile(p, JSON.stringify(products));
    }
  }

  static async fetchAll() {
    return await db.query("SELECT * FROM products");
  }

  static async findById(id) {
    const products = await getFileContent();
    const product = products.find((p) => p.id === id);
    return product;
  }

  static async deleteById(id) {
    try {
      const products = await getFileContent();
      const product = products.find((p) => p.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);
      await fs.writeFile(p, JSON.stringify(updatedProducts));
      await Cart.deleteProduct(id, product.price);
    } catch (error) {
      console.log(error);
    }
  }
}

export default Product;
