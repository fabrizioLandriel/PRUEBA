import mongoose from "mongoose";
const ticketsCollection = "tickets";
const ticketsSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    purchase_datetime: { type: Date },
    amount: Number,
    purchaser: String,
    products: {
      type: [
        {
          product: {
            type: mongoose.Types.ObjectId,
            ref: "products",
          },
          quantity: Number,
        },
      ],
    },
  },
  {
    strict: false,
  }
);

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
