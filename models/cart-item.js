import sequelize from "../util/dbconfig.js";
import { Sequelize, DataTypes } from "sequelize";

const CartItem = sequelize.define("cart-item", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

export default CartItem;
