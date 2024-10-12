import { config } from "dotenv";
import mongodb from "mongodb";

config();

let _db;
const MongoClient = mongodb.MongoClient;

export const mongoConnect = async () => {
  const client = await MongoClient.connect(process.env.DATABASE_URL);
  _db = client.db("shop");
};

export const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "No DB found!";
};
