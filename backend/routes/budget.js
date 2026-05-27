const express = require("express");
const Budget = require("../models/Budget");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

// GET /api/budget/:eventId
router.get("/:eventId", async (req, res) => {
  try {
    let budget = await Budget.findOne({ eventId: req.params.eventId, userId: req.user.id });
    if (!budget) {
      // Auto-create if not exists
      budget = await Budget.create({ eventId: req.params.eventId, userId: req.user.id, totalBudget: 0, expenses: [] });
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/budget/:eventId — update total budget
router.put("/:eventId", async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { eventId: req.params.eventId, userId: req.user.id },
      { totalBudget: req.body.totalBudget },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/budget/:eventId/expenses — add expense
router.post("/:eventId/expenses", async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { eventId: req.params.eventId, userId: req.user.id },
      { $push: { expenses: req.body } },
      { new: true, upsert: true }
    );
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/budget/:eventId/expenses/:expenseId — update expense
router.put("/:eventId/expenses/:expenseId", async (req, res) => {
  try {
    const budget = await Budget.findOne({ eventId: req.params.eventId, userId: req.user.id });
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

// DELETE /api/budget/:eventId/expenses/:expenseId
router.delete("/:eventId/expenses/:expenseId", async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { eventId: req.params.eventId, userId: req.user.id },
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
