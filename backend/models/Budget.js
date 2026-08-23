const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  eventId: { type: String, default: "" },
  category: {
    type: String,
    enum: ["Venue", "Catering", "Decoration", "Photography", "Music & DJ", "Flowers", "Transport", "Attire", "Invitations", "Gifts", "Miscellaneous"],
    default: "Miscellaneous",
  },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  paid: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    totalBudget: { type: Number, default: 0, min: 0 },
    expenses: [expenseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
