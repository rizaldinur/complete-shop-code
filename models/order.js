import sequelize from "../util/dbconfig.js";
import { Sequelize, DataTypes } from "sequelize";

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

export default Order;
