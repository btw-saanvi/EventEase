const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["venue", "catering", "decoration", "photography", "entertainment", "transport", "attire", "invitations", "misc"],
    default: "misc",
  },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  paid: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const budgetSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalBudget: { type: Number, default: 0, min: 0 },
    expenses: [expenseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
