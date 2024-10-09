import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(process.env.DBConnLink, {
  dialect: "postgres",
});

export default sequelize;
