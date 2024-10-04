import rootDir from "../util/path.js";
import path from "path";
import fs from "fs/promises";
import { get } from "http";
import { writeFile } from "fs";

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
  constructor(t) {
    this.title = t;
  }

  async save() {
    const products = await getFileContent();
    console.log(this);
    products.push(this);
    await fs.writeFile(p, JSON.stringify(products));
  }

  static async fetchAll() {
    return await getFileContent();
  }
}

export default Product;
