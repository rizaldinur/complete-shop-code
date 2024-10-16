import { ObjectId } from "mongodb";
import { getDB } from "../util/dbconfig.js";

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
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
}
export default User;
