import sequelize from "../util/dbconfig.js";
import { Sequelize, DataTypes } from "sequelize";

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
});

export default OrderItem;
