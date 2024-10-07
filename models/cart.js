import rootDir from "../util/path.js";
import path from "path";
import fs from "fs/promises";

const p = path.join(rootDir, "data", "cart.json");

class Cart {
  static async addProduct(id, productPrice) {
    let cart = { products: [], totalPrice: 0 };
    try {
      const fileContent = await fs.readFile(p);
      if (fileContent) {
        cart = JSON.parse(fileContent);
      }
    } catch (error) {
      console.log(error);
    }

    //cek existing product is in cart?
    const existingProductIndex = cart.products.findIndex((p) => p.id === id);
    const existingProduct = cart.products[existingProductIndex];
    let updatedProduct;
    //add qty if exist or new product
    if (existingProduct) {
      updatedProduct = { ...existingProduct };
      updatedProduct.qty = updatedProduct.qty + 1;
      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id: id, qty: 1 };
      cart.products = [...cart.products, updatedProduct];
    }
    //count price
    cart.totalPrice = cart.totalPrice + +productPrice;

    try {
      await fs.writeFile(p, JSON.stringify(cart));
    } catch (error) {
      console.log(error);
    }
  }
}

export default Cart;
