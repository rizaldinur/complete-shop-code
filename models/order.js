import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  // transaction_status: { type: Schema.Types.String, required: true },
  transaction: {
    status: { type: Schema.Types.String, required: true },
    status_code: { type: Schema.Types.String, required: true },
    token: { type: Schema.Types.String, required: true },
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
