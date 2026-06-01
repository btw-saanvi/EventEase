import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, Trash2, Edit3, X, Search, CheckCircle, XCircle, Clock, UtensilsCrossed } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const RSVP_CONFIG = {
  pending: { label: "Pending", color: "#FFD933", bgClass: "bg-oatly-yellow", icon: Clock },
  confirmed: { label: "Confirmed", color: "#A4CBA3", bgClass: "bg-oatly-green", icon: CheckCircle },
  declined: { label: "Declined", color: "#FF6B6B", bgClass: "bg-[#FF6B6B]", icon: XCircle },
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="brutal-card bg-white w-full max-w-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
          <h2 className="font-heading text-2xl text-black uppercase">{guest ? "Edit Guest" : "Add Guest"}</h2>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white hover:bg-oatly-pink transition-colors shadow-[2px_2px_0px_#000]"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-heading uppercase text-black mb-1.5">Full Name *</label>
            <input
              id="guest-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Priya Sharma"
              className="input-brutal w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Email</label>
              <input
                id="guest-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="priya@example.com"
                className="input-brutal w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Phone</label>
              <input
                id="guest-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="input-brutal w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">RSVP Status</label>
              <select
                id="guest-rsvp"
                value={form.rsvp}
                onChange={(e) => setForm({ ...form, rsvp: e.target.value })}
                className="input-brutal w-full bg-white cursor-pointer"
              >
                {Object.entries(RSVP_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Table Number</label>
              <input
                id="guest-table"
                type="text"
                value={form.table}
                onChange={(e) => setForm({ ...form, table: e.target.value })}
                placeholder="e.g. Table 5"
                className="input-brutal w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-heading uppercase text-black mb-1.5">Dietary Requirements</label>
            <select
              id="guest-dietary"
              value={form.dietary}
              onChange={(e) => setForm({ ...form, dietary: e.target.value })}
              className="input-brutal w-full bg-white cursor-pointer"
            >
              {DIETARY.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.plusOne}
              onChange={(e) => setForm({ ...form, plusOne: e.target.checked })}
              className="w-5 h-5 border-2 border-black accent-black cursor-pointer bg-white"
            />
            <span className="text-sm font-heading uppercase text-black select-none">Bringing a +1</span>
          </label>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="btn-brutal bg-white w-full py-2.5">Cancel</button>
            <button type="submit" className="btn-brutal btn-brutal-pink w-full py-2.5">{guest ? "Save Changes" : "Add Guest"}</button>
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
    onSuccess: () => {
      queryClient.invalidateQueries(["guests"]);
      toast.success("Guest added!");
      setShowModal(false);
    },
    onError: () => toast.error("Failed to add guest"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/guests/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["guests"]);
      toast.success("Guest updated!");
      setEditGuest(null);
    },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/guests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["guests"]);
      toast.success("Guest removed");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const filtered = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email?.toLowerCase().includes(search.toLowerCase());
    const matchRsvp = filterRsvp === "all" || g.rsvp === filterRsvp;
    return matchSearch && matchRsvp;
  });

  const stats = [
    { label: "Total Guests", value: guests.length, color: "bg-white" },
    { label: "Confirmed", value: guests.filter((g) => g.rsvp === "confirmed").length, color: "bg-oatly-green" },
    { label: "Pending", value: guests.filter((g) => g.rsvp === "pending").length, color: "bg-oatly-yellow" },
    { label: "Declined", value: guests.filter((g) => g.rsvp === "declined").length, color: "bg-oatly-pink" },
  ];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b-3 border-black pb-6">
        <div>
          <h1 className="font-heading text-4xl text-black uppercase mb-1">Guest Management</h1>
          <p className="font-body font-bold text-black/60">Track RSVPs and manage your guest list</p>
        </div>
        <button
          id="add-guest-btn"
          onClick={() => setShowModal(true)}
          className="btn-brutal btn-brutal-pink flex items-center gap-2 py-2.5 px-5"
        >
          <Plus className="w-5 h-5 text-black" /> Add Guest
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`brutal-card p-5 text-center ${s.color}`}>
            <div className="text-4xl font-heading text-black mb-1">{s.value}</div>
            <div className="text-xs font-heading uppercase text-black/70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-black/60" />
          <input
            id="guest-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-brutal w-full pl-11"
          />
        </div>
        <select
          id="rsvp-filter"
          value={filterRsvp}
          onChange={(e) => setFilterRsvp(e.target.value)}
          className="input-brutal min-w-[160px] bg-white cursor-pointer"
        >
          <option value="all">All RSVP</option>
          {Object.entries(RSVP_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Guest List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 brutal-card bg-white animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="brutal-card bg-white p-12 text-center">
          <div className="w-16 h-16 bg-oatly-blue border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-black" />
          </div>
          <h3 className="font-heading text-2xl text-black uppercase mb-2">
            {guests.length === 0 ? "No guests yet" : "No matching guests"}
          </h3>
          <p className="font-body font-bold text-black/60 mb-6">
            {guests.length === 0 ? "Start adding guests to your event" : "Try adjusting your search or filters"}
          </p>
          {guests.length === 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-brutal btn-brutal-pink mx-auto flex items-center gap-2 px-6 py-2.5"
            >
              <Plus className="w-5 h-5" /> Add Guest
            </button>
          )}
        </div>
      ) : (
        <div className="brutal-card bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-3 border-black bg-oatly-bg">
                  <th className="text-left px-5 py-4 text-sm font-heading uppercase text-black tracking-wider">Name</th>
                  <th className="text-left px-5 py-4 text-sm font-heading uppercase text-black tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-4 text-sm font-heading uppercase text-black tracking-wider">RSVP</th>
                  <th className="text-left px-5 py-4 text-sm font-heading uppercase text-black tracking-wider hidden lg:table-cell">Table</th>
                  <th className="text-left px-5 py-4 text-sm font-heading uppercase text-black tracking-wider hidden lg:table-cell">Diet</th>
                  <th className="text-right px-5 py-4 text-sm font-heading uppercase text-black tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {filtered.map((guest) => {
                  const rsvp = RSVP_CONFIG[guest.rsvp] || RSVP_CONFIG.pending;
                  const RsvpIcon = rsvp.icon;
                  return (
                    <tr key={guest._id} className="hover:bg-oatly-bg/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 border-2 border-black bg-oatly-blue shadow-[2px_2px_0px_#000] flex items-center justify-center text-sm font-heading text-black flex-shrink-0">
                            {guest.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-body font-bold text-black leading-tight">{guest.name}</div>
                            {guest.plusOne && <div className="text-xs font-body font-bold text-black/50 mt-0.5">+1 guest allowed</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-body font-semibold text-black/70 hidden md:table-cell">
                        {guest.email || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 border-2 border-black ${rsvp.bgClass} text-xs font-heading uppercase text-black shadow-[2px_2px_0px_#000]`}>
                          <RsvpIcon className="w-3.5 h-3.5 text-black" />
                          {rsvp.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-body font-bold text-black hidden lg:table-cell">
                        {guest.table || "—"}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {guest.dietary && guest.dietary !== "None" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border-2 border-black bg-oatly-yellow text-xs font-heading uppercase text-black shadow-[2px_2px_0px_#000]">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-black" />
                            {guest.dietary}
                          </span>
                        ) : (
                          <span className="text-black/55 text-sm font-body font-semibold">None</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`edit-guest-${guest._id}`}
                            onClick={() => setEditGuest(guest)}
                            className="p-1.5 border-2 border-black bg-white hover:bg-oatly-blue transition-colors shadow-[2px_2px_0px_#000]"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4 text-black" />
                          </button>
                          <button
                            id={`delete-guest-${guest._id}`}
                            onClick={() => deleteMutation.mutate(guest._id)}
                            className="p-1.5 border-2 border-black bg-white hover:bg-[#FF6B6B] transition-colors shadow-[2px_2px_0px_#000]"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-black" />
                          </button>
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
      {editGuest && (
        <GuestModal
          guest={editGuest}
          onClose={() => setEditGuest(null)}
          onSave={(d) => updateMutation.mutate({ id: editGuest._id, data: d })}
        />
      )}
    </div>
  );
}
