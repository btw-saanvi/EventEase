const express = require("express");
const validator = require("validator");
const Budget = require("../models/Budget");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// Whitelist of fields for an expense entry
const ALLOWED_EXPENSE_FIELDS = [
  "category", "description", "amount", "date", "vendor", "eventId", "status", "notes"
];

function pickExpenseFields(body) {
  const data = {};
  ALLOWED_EXPENSE_FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
}

// GET /api/budget — get user's budget (auto-create if none)
router.get("/", async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      budget = await Budget.create({ userId: req.user.id, totalBudget: 0, expenses: [] });
    }
    res.json(budget);
  } catch (err) {
    console.error("Get budget error:", err.message);
    res.status(500).json({ message: "Could not fetch budget." });
  }
});

// PUT /api/budget — update total budget (validated number only)
router.put("/", async (req, res) => {
  try {
    const totalBudget = parseFloat(req.body.totalBudget);
    if (isNaN(totalBudget) || totalBudget < 0) {
      return res.status(400).json({ message: "totalBudget must be a non-negative number." });
    }
    if (totalBudget > 1_000_000_000) {
      return res.status(400).json({ message: "Budget value is unreasonably large." });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { totalBudget },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    console.error("Update budget error:", err.message);
    res.status(400).json({ message: err.message || "Could not update budget." });
  }
});

// POST /api/budget/expenses — add expense (whitelisted fields only)
router.post("/expenses", async (req, res) => {
  try {
    const data = pickExpenseFields(req.body);

    if (!data.category) return res.status(400).json({ message: "Expense category is required." });
    if (data.amount !== undefined) {
      const amt = parseFloat(data.amount);
      if (isNaN(amt) || amt < 0) return res.status(400).json({ message: "Amount must be a non-negative number." });
      data.amount = amt;
    }
    if (data.description) data.description = validator.trim(String(data.description)).slice(0, 500);
    if (data.notes)       data.notes       = validator.trim(String(data.notes)).slice(0, 500);
    if (data.vendor)      data.vendor      = validator.trim(String(data.vendor)).slice(0, 200);

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { expenses: data } },
      { new: true, upsert: true }
    );
    res.status(201).json(budget);
  } catch (err) {
    console.error("Add expense error:", err.message);
    res.status(400).json({ message: err.message || "Could not add expense." });
  }
});

// PUT /api/budget/expenses/:expenseId — update expense (whitelisted only)
router.put("/expenses/:expenseId", async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found." });

    const expense = budget.expenses.id(req.params.expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found." });

    const data = pickExpenseFields(req.body);
    if (data.amount !== undefined) {
      const amt = parseFloat(data.amount);
      if (isNaN(amt) || amt < 0) return res.status(400).json({ message: "Amount must be a non-negative number." });
      data.amount = amt;
    }
    if (data.description) data.description = validator.trim(String(data.description)).slice(0, 500);
    if (data.notes)       data.notes       = validator.trim(String(data.notes)).slice(0, 500);
    if (data.vendor)      data.vendor      = validator.trim(String(data.vendor)).slice(0, 200);

    Object.assign(expense, data);
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error("Update expense error:", err.message);
    res.status(400).json({ message: err.message || "Could not update expense." });
  }
});

// DELETE /api/budget/expenses/:expenseId — remove expense
router.delete("/expenses/:expenseId", async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { expenses: { _id: req.params.expenseId } } },
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: "Budget not found." });
    res.json(budget);
  } catch (err) {
    console.error("Delete expense error:", err.message);
    res.status(500).json({ message: "Could not delete expense." });
  }
});

module.exports = router;
