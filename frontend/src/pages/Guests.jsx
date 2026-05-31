import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, Trash2, Edit3, X, Search, CheckCircle, XCircle, Clock, UtensilsCrossed } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const RSVP_CONFIG = {
  pending: { label: "Pending", color: "#fbbf24", icon: Clock },
  confirmed: { label: "Confirmed", color: "#34d399", icon: CheckCircle },
  declined: { label: "Declined", color: "#f87171", icon: XCircle },
};

const DIETARY = ["None", "Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "Nut Allergy", "Dairy-Free"];

function GuestModal({ guest, onClose, onSave }) {
  const [form, setForm] = useState(
    guest || { name: "", email: "", phone: "", rsvp: "pending", table: "", dietary: "None", plusOne: false }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return toast.error("Guest name is required");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-white">{guest ? "Edit Guest" : "Add Guest"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
            <input id="guest-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" className="vapor-input w-full" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input id="guest-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="priya@example.com" className="vapor-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
              <input id="guest-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="vapor-input w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">RSVP Status</label>
              <select id="guest-rsvp" value={form.rsvp} onChange={(e) => setForm({ ...form, rsvp: e.target.value })} className="vapor-input w-full">
                {Object.entries(RSVP_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Table Number</label>
              <input id="guest-table" type="text" value={form.table} onChange={(e) => setForm({ ...form, table: e.target.value })} placeholder="e.g. Table 5" className="vapor-input w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Dietary Requirements</label>
            <select id="guest-dietary" value={form.dietary} onChange={(e) => setForm({ ...form, dietary: e.target.value })} className="vapor-input w-full">
              {DIETARY.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.plusOne} onChange={(e) => setForm({ ...form, plusOne: e.target.checked })} className="w-4 h-4 rounded border-vapor-border accent-violet-500" />
            <span className="text-sm text-slate-300">Bringing a +1</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-vapor flex-1 py-2.5">Cancel</button>
            <button type="submit" className="btn-vapor-solid flex-1 py-2.5">{guest ? "Save Changes" : "Add Guest"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Guests() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRsvp, setFilterRsvp] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["guests"],
    queryFn: () => api.get("/guests").then((r) => r.data),
  });

  const guests = data?.guests || [];

  const createMutation = useMutation({
    mutationFn: (d) => api.post("/guests", d),
    onSuccess: () => { queryClient.invalidateQueries(["guests"]); toast.success("Guest added!"); setShowModal(false); },
    onError: () => toast.error("Failed to add guest"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/guests/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries(["guests"]); toast.success("Guest updated!"); setEditGuest(null); },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/guests/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(["guests"]); toast.success("Guest removed"); },
    onError: () => toast.error("Failed to delete"),
  });

  const filtered = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.email?.toLowerCase().includes(search.toLowerCase());
    const matchRsvp = filterRsvp === "all" || g.rsvp === filterRsvp;
    return matchSearch && matchRsvp;
  });

  const stats = [
    { label: "Total Guests", value: guests.length, color: "#818cf8" },
    { label: "Confirmed", value: guests.filter((g) => g.rsvp === "confirmed").length, color: "#34d399" },
    { label: "Pending", value: guests.filter((g) => g.rsvp === "pending").length, color: "#fbbf24" },
    { label: "Declined", value: guests.filter((g) => g.rsvp === "declined").length, color: "#f87171" },
  ];

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white mb-1">Guest Management</h1>
          <p className="text-slate-400">Track RSVPs and manage your guest list</p>
        </div>
        <button id="add-guest-btn" onClick={() => setShowModal(true)} className="btn-vapor-solid flex items-center gap-2 px-5 py-2.5">
          <Plus className="w-4 h-4" /> Add Guest
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-card text-center">
            <div className="text-3xl font-heading font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            id="guest-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="vapor-input w-full pl-9"
          />
        </div>
        <select
          id="rsvp-filter"
          value={filterRsvp}
          onChange={(e) => setFilterRsvp(e.target.value)}
          className="vapor-input min-w-32"
        >
          <option value="all">All RSVP</option>
          {Object.entries(RSVP_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Guest List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 glass-card animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-slate-300 mb-2">{guests.length === 0 ? "No guests yet" : "No matching guests"}</h3>
          <p className="text-slate-500 mb-6">{guests.length === 0 ? "Start adding guests to your event" : "Try adjusting your search or filters"}</p>
          {guests.length === 0 && (
            <button onClick={() => setShowModal(true)} className="btn-vapor-solid mx-auto flex items-center gap-2 px-6 py-2.5">
              <Plus className="w-4 h-4" /> Add Guest
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-vapor-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">RSVP</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Table</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Diet</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vapor-border/30">
                {filtered.map((guest) => {
                  const rsvp = RSVP_CONFIG[guest.rsvp] || RSVP_CONFIG.pending;
                  const RsvpIcon = rsvp.icon;
                  return (
                    <tr key={guest._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {guest.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-200">{guest.name}</div>
                            {guest.plusOne && <div className="text-xs text-slate-500">+1 guest</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400 hidden md:table-cell">{guest.email || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${rsvp.color}20`, color: rsvp.color }}>
                          <RsvpIcon className="w-3 h-3" />
                          {rsvp.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400 hidden lg:table-cell">{guest.table || "—"}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {guest.dietary && guest.dietary !== "None" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white/5 text-slate-300">
                            <UtensilsCrossed className="w-3 h-3" />{guest.dietary}
                          </span>
                        ) : <span className="text-slate-500 text-sm">None</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button id={`edit-guest-${guest._id}`} onClick={() => setEditGuest(guest)} className="p-1.5 text-slate-400 hover:text-vapor-lavender transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button id={`delete-guest-${guest._id}`} onClick={() => deleteMutation.mutate(guest._id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && <GuestModal onClose={() => setShowModal(false)} onSave={(d) => createMutation.mutate(d)} />}
      {editGuest && <GuestModal guest={editGuest} onClose={() => setEditGuest(null)} onSave={(d) => updateMutation.mutate({ id: editGuest._id, data: d })} />}
    </div>
  );
}
