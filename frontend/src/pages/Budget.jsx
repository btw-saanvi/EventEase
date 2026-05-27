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
  Venue: "#818cf8", Catering: "#67e8f9", Decoration: "#f0abfc",
  Photography: "#c4b5fd", "Music & DJ": "#34d399", Flowers: "#fb7185",
  Transport: "#fbbf24", Attire: "#a78bfa", Invitations: "#38bdf8",
  Gifts: "#4ade80", Miscellaneous: "#94a3b8",
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-white">{expense ? "Edit Expense" : "Add Expense"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
            <input
              id="expense-description"
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Banquet Hall deposit"
              className="vapor-input w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <select
                id="expense-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="vapor-input w-full"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount (₹) *</label>
              <input
                id="expense-amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                min="0"
                className="vapor-input w-full"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Event ID (optional)</label>
            <input
              type="text"
              value={form.eventId}
              onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              placeholder="Link to an event"
              className="vapor-input w-full"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-vapor flex-1 py-2.5">Cancel</button>
            <button type="submit" className="btn-vapor-solid flex-1 py-2.5">{expense ? "Save Changes" : "Add Expense"}</button>
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
    mutationFn: (d) => api.post("/budget", d),
    onSuccess: () => { queryClient.invalidateQueries(["budget"]); toast.success("Expense added!"); setShowModal(false); },
    onError: () => toast.error("Failed to add expense"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/budget/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(["budget"]); toast.success("Expense updated!"); setEditExpense(null); },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/budget/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(["budget"]); toast.success("Expense removed"); },
    onError: () => toast.error("Failed to delete"),
  });

  // Category breakdown
  const categoryBreakdown = CATEGORIES.map((cat) => ({
    name: cat,
    amount: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
    color: CATEGORY_COLORS[cat],
  })).filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white mb-1">Budget Tracker</h1>
          <p className="text-slate-400">Track your event expenses and stay on budget</p>
        </div>
        <button id="add-expense-btn" onClick={() => setShowModal(true)} className="btn-vapor-solid flex items-center gap-2 px-5 py-2.5">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card md:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Total Budget</span>
            <button
              onClick={() => { setEditingBudget(true); setBudgetInput(totalBudget); }}
              className="text-xs text-vapor-lavender hover:underline"
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
                className="vapor-input flex-1 text-sm py-1"
              />
              <button
                onClick={() => { setTotalBudget(parseFloat(budgetInput)); setEditingBudget(false); }}
                className="btn-vapor-solid px-3 py-1 text-xs"
              >
                Set
              </button>
            </div>
          ) : (
            <div className="text-2xl font-heading font-bold text-white">{formatCurrency(totalBudget)}</div>
          )}
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 mb-1">Total Spent</div>
          <div className="text-2xl font-heading font-bold" style={{ color: spentPercent > 90 ? "#f87171" : "#f0abfc" }}>
            {formatCurrency(totalSpent)}
          </div>
          <div className="text-xs text-slate-500 mt-1">{spentPercent.toFixed(1)}% of budget</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 mb-1">Remaining</div>
          <div className="text-2xl font-heading font-bold" style={{ color: remaining < 0 ? "#f87171" : "#34d399" }}>
            {formatCurrency(Math.abs(remaining))}
          </div>
          <div className="text-xs text-slate-500 mt-1">{remaining < 0 ? "Over budget!" : "Available"}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Budget Usage</span>
          <span>{spentPercent.toFixed(1)}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${spentPercent}%`,
              background: spentPercent > 90
                ? "linear-gradient(90deg, #f87171, #ef4444)"
                : "linear-gradient(90deg, #818cf8, #67e8f9)"
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="glass-card p-5 lg:col-span-1">
            <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-vapor-lavender" /> By Category
            </h3>
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="font-medium" style={{ color: cat.color }}>{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(cat.amount / totalSpent) * 100}%`, background: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense List */}
        <div className={`glass-card p-5 ${categoryBreakdown.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-vapor-lavender" /> All Expenses
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No expenses yet. Add your first one!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-3 rounded-lg bg-white/3 hover:bg-white/6 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-8 rounded-full flex-shrink-0"
                      style={{ background: CATEGORY_COLORS[expense.category] || "#94a3b8" }}
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-200">{expense.description}</div>
                      <div className="text-xs text-slate-500">{expense.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-white">{formatCurrency(expense.amount)}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditExpense(expense)} className="p-1 text-slate-400 hover:text-vapor-lavender"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteMutation.mutate(expense._id)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && <ExpenseModal onClose={() => setShowModal(false)} onSave={(d) => createMutation.mutate(d)} />}
      {editExpense && <ExpenseModal expense={editExpense} onClose={() => setEditExpense(null)} onSave={(d) => updateMutation.mutate({ id: editExpense._id, data: d })} />}
    </div>
  );
}
