const express = require("express");
const Budget = require("../models/Budget");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// GET /api/budget - Get user's budget (auto-create if none)
router.get("/", async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      budget = await Budget.create({ userId: req.user.id, totalBudget: 0, expenses: [] });
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/budget - Update total budget
router.put("/", async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { totalBudget: req.body.totalBudget },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/budget/expenses - Add expense
router.post("/expenses", async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { expenses: req.body } },
      { new: true, upsert: true }
    );
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/budget/expenses/:expenseId - Update expense
router.put("/expenses/:expenseId", async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const expense = budget.expenses.id(req.params.expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    Object.assign(expense, req.body);
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/budget/expenses/:expenseId
router.delete("/expenses/:expenseId", async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { expenses: { _id: req.params.expenseId } } },
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
