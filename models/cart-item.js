import sequelize from "../util/dbconfig.js";
import { Sequelize, DataTypes } from "sequelize";

const CartItem = sequelize.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
});

export default CartItem;
