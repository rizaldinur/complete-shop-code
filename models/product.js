import rootDir from "../util/path.js";
import path from "path";
import fs from "fs";

const p = path.join(rootDir, "data", "products.json");
class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, (err, fileContent) => {
        if (err) {
          reject([]);
        } else {
          resolve(JSON.parse(fileContent));
        }
      });
    });
  }
}

export default Product;
