import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, DollarSign, Trash2, Edit3, X, TrendingUp } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const CATEGORIES = [
  "Venue", "Catering", "Decoration", "Photography", "Music & DJ",
  "Flowers", "Transport", "Attire", "Invitations", "Gifts", "Miscellaneous"
];

const CATEGORY_COLORS = {
  Venue: "#FFB0C2", // pink
  Catering: "#FFD933", // yellow
  Decoration: "#A7D7E8", // blue
  Photography: "#A4CBA3", // green
  "Music & DJ": "#FFB0C2",
  Flowers: "#FFD933",
  Transport: "#A7D7E8",
  Attire: "#A4CBA3",
  Invitations: "#FFB0C2",
  Gifts: "#FFD933",
  Miscellaneous: "#A7D7E8",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function ExpenseModal({ expense, onClose, onSave, eventId }) {
  const [form, setForm] = useState(
    expense || { description: "", category: "Venue", amount: "", eventId: eventId || "" }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return toast.error("Description and amount are required");
    onSave({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="brutal-card bg-white w-full max-w-md p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
          <h2 className="font-heading text-2xl text-black uppercase">{expense ? "Edit Expense" : "Add Expense"}</h2>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white hover:bg-oatly-pink transition-colors shadow-[2px_2px_0px_#000]"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-heading uppercase text-black mb-1.5">Description *</label>
            <input
              id="expense-description"
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Banquet Hall deposit"
              className="input-brutal w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Category</label>
              <select
                id="expense-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-brutal w-full bg-white cursor-pointer"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Amount (₹) *</label>
              <input
                id="expense-amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                min="0"
                className="input-brutal w-full"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="btn-brutal bg-white w-full py-2.5">Cancel</button>
            <button type="submit" className="btn-brutal btn-brutal-pink w-full py-2.5">{expense ? "Save Changes" : "Add Expense"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Budget() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [totalBudget, setTotalBudget] = useState(500000);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["budget"],
    queryFn: () => api.get("/budget").then((r) => r.data),
  });

  const expenses = data?.expenses || [];
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const remaining = totalBudget - totalSpent;
  const spentPercent = Math.min(100, (totalSpent / totalBudget) * 100);

  const createMutation = useMutation({
    mutationFn: (d) => api.post("/budget/expenses", d),
    onSuccess: () => { queryClient.invalidateQueries(["budget"]); toast.success("Expense added!"); setShowModal(false); },
    onError: () => toast.error("Failed to add expense"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/budget/expenses/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(["budget"]); toast.success("Expense updated!"); setEditExpense(null); },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/budget/expenses/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(["budget"]); toast.success("Expense removed"); },
    onError: () => toast.error("Failed to delete"),
  });

  const updateBudgetMutation = useMutation({
    mutationFn: (amount) => api.put("/budget", { totalBudget: amount }),
    onSuccess: () => { queryClient.invalidateQueries(["budget"]); toast.success("Budget updated"); },
  });

  // Category breakdown
  const categoryBreakdown = CATEGORIES.map((cat) => ({
    name: cat,
    amount: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
    color: CATEGORY_COLORS[cat],
  })).filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount);

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b-3 border-black pb-6">
        <div>
          <h1 className="font-heading text-4xl text-black uppercase mb-1">Budget Tracker</h1>
          <p className="font-body font-bold text-black/60">Track your event expenses and stay on budget</p>
        </div>
        <button
          id="add-expense-btn"
          onClick={() => setShowModal(true)}
          className="btn-brutal btn-brutal-pink flex items-center gap-2 py-2.5 px-5"
        >
          <Plus className="w-5 h-5 text-black" /> Add Expense
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="brutal-card bg-white p-5">
          <div className="flex items-center justify-between mb-1 border-b-2 border-black/10 pb-2">
            <span className="text-xs font-heading uppercase text-black/60">Total Budget</span>
            <button
              onClick={() => { setEditingBudget(true); setBudgetInput(totalBudget); }}
              className="text-xs font-heading uppercase text-oatly-blue hover:underline"
            >
              Edit
            </button>
          </div>
          {editingBudget ? (
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="input-brutal flex-1 text-sm py-1 px-2"
              />
              <button
                onClick={() => { 
                  const amt = parseFloat(budgetInput);
                  setTotalBudget(amt); 
                  setEditingBudget(false); 
                  updateBudgetMutation.mutate(amt);
                }}
                className="btn-brutal btn-brutal-pink px-4 py-1 text-xs"
              >
                Set
              </button>
            </div>
          ) : (
            <div className="text-3xl font-heading text-black mt-2">{formatCurrency(totalBudget)}</div>
          )}
        </div>

        <div className={`brutal-card p-5 ${spentPercent > 90 ? "bg-[#FF6B6B]" : "bg-oatly-pink"}`}>
          <div className="text-xs font-heading uppercase text-black/70 mb-1 border-b-2 border-black/10 pb-2">Total Spent</div>
          <div className="text-3xl font-heading text-black mt-2">
            {formatCurrency(totalSpent)}
          </div>
          <div className="text-xs font-body font-bold text-black/60 mt-1">{spentPercent.toFixed(1)}% of budget</div>
        </div>

        <div className={`brutal-card p-5 ${remaining < 0 ? "bg-[#FF6B6B]" : "bg-oatly-green"}`}>
          <div className="text-xs font-heading uppercase text-black/70 mb-1 border-b-2 border-black/10 pb-2">Remaining</div>
          <div className="text-3xl font-heading text-black mt-2">
            {formatCurrency(Math.abs(remaining))}
          </div>
          <div className="text-xs font-body font-bold text-black/60 mt-1">{remaining < 0 ? "Over budget!" : "Available"}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="brutal-card bg-white p-5 mb-8">
        <div className="flex items-center justify-between text-sm font-heading uppercase text-black mb-3">
          <span>Budget Usage Tracker</span>
          <span>{spentPercent.toFixed(1)}%</span>
        </div>
        <div className="h-6 border-3 border-black bg-oatly-bg shadow-[2px_2px_0px_#000] overflow-hidden">
          <div
            className={`h-full border-r-3 border-black transition-all duration-700 ${
              spentPercent > 90 ? "bg-[#FF6B6B]" : "bg-oatly-pink"
            }`}
            style={{ width: `${spentPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="brutal-card bg-white p-5 lg:col-span-1">
            <h3 className="font-heading text-xl text-black uppercase mb-5 border-b-2 border-black pb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-black" /> By Category
            </h3>
            <div className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm font-body font-bold text-black mb-1.5">
                    <span>{cat.name}</span>
                    <span>{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-3 border-2 border-black bg-oatly-bg overflow-hidden shadow-[1px_1px_0px_#000]">
                    <div
                      className="h-full border-r-2 border-black"
                      style={{
                        width: `${(cat.amount / totalSpent) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense List */}
        <div className={`brutal-card bg-white p-5 ${categoryBreakdown.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <h3 className="font-heading text-xl text-black uppercase mb-5 border-b-2 border-black pb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-black" /> All Expenses
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 brutal-card bg-white animate-pulse" />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-oatly-yellow border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-black" />
              </div>
              <p className="font-body font-bold text-black/60">No expenses yet. Add your first one!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-3.5 border-2 border-black bg-white hover:bg-oatly-bg/25 transition-all shadow-[2px_2px_0px_#000] mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 border-2 border-black shadow-[1.5px_1.5px_0px_#000] flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] || "#1E1E1E" }}
                    />
                    <div>
                      <div className="text-sm font-heading uppercase text-black leading-none mb-1">{expense.description}</div>
                      <div className="text-xs font-body font-bold text-black/50">{expense.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-lg text-black">{formatCurrency(expense.amount)}</span>
                    <div className="flex gap-1.5 ml-2">
                      <button
                        onClick={() => setEditExpense(expense)}
                        className="p-1.5 border-2 border-black bg-white hover:bg-oatly-blue transition-colors shadow-[1.5px_1.5px_0px_#000]"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-black" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(expense._id)}
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#FF6B6B] transition-colors shadow-[1.5px_1.5px_0px_#000]"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && <ExpenseModal onClose={() => setShowModal(false)} onSave={(d) => createMutation.mutate(d)} />}
      {editExpense && (
        <ExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onSave={(d) => updateMutation.mutate({ id: editExpense._id, data: d })}
        />
      )}
    </div>
  );
}
