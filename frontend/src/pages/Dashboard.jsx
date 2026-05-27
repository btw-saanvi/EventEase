import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Calendar, Users, Trash2, Edit3, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const STATUS_CONFIG = {
  planning: { label: "Planning", color: "#818cf8", icon: Clock },
  active: { label: "Active", color: "#34d399", icon: CheckCircle },
  completed: { label: "Completed", color: "#67e8f9", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#f87171", icon: AlertCircle },
};

function EventModal({ event, onClose, onSave }) {
  const [form, setForm] = useState(
    event || { name: "", date: "", location: "", description: "", status: "planning", guestCount: 0 }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.date) return toast.error("Name and date are required");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-white">{event ? "Edit Event" : "Create Event"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Event Name *</label>
            <input
              id="event-name-input"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Wedding Ceremony"
              className="vapor-input w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Date *</label>
              <input
                id="event-date-input"
                type="date"
                value={form.date ? form.date.slice(0, 10) : ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="vapor-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
              <select
                id="event-status-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="vapor-input w-full"
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label>
            <input
              id="event-location-input"
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Grand Ballroom, Mumbai"
              className="vapor-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              id="event-description-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the event..."
              rows={3}
              className="vapor-input w-full resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-vapor flex-1 py-2.5">Cancel</button>
            <button type="submit" className="btn-vapor-solid flex-1 py-2.5">{event ? "Save Changes" : "Create Event"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => api.get("/events").then((r) => r.data),
  });

  const events = eventsData?.events || [];

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/events", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast.success("Event created!");
      setShowModal(false);
    },
    onError: () => toast.error("Failed to create event"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast.success("Event updated!");
      setEditEvent(null);
    },
    onError: () => toast.error("Failed to update event"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      toast.success("Event deleted");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const stats = [
    { label: "Total Events", value: events.length, color: "#818cf8" },
    { label: "Active", value: events.filter((e) => e.status === "active").length, color: "#34d399" },
    { label: "Planning", value: events.filter((e) => e.status === "planning").length, color: "#f0abfc" },
    { label: "Completed", value: events.filter((e) => e.status === "completed").length, color: "#67e8f9" },
  ];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-slate-400">Manage and track all your events</p>
        </div>
        <button
          id="create-event-btn"
          onClick={() => setShowModal(true)}
          className="btn-vapor-solid flex items-center gap-2 px-5 py-2.5"
        >
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="stat-card text-center">
            <div className="text-3xl font-heading font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-5 bg-white/10 rounded mb-3 w-3/4" />
              <div className="h-4 bg-white/5 rounded mb-2 w-1/2" />
              <div className="h-4 bg-white/5 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-slate-300 mb-2">No events yet</h3>
          <p className="text-slate-500 mb-6">Create your first event to get started</p>
          <button onClick={() => setShowModal(true)} className="btn-vapor-solid flex items-center gap-2 mx-auto px-6 py-2.5">
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const status = STATUS_CONFIG[event.status] || STATUS_CONFIG.planning;
            const StatusIcon = status.icon;
            return (
              <div key={event._id} className="glass-card p-6 group hover:border-vapor-lavender/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-white truncate mb-1">{event.name}</h3>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: `${status.color}20`, color: status.color }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                    <button
                      id={`edit-event-${event._id}`}
                      onClick={() => setEditEvent(event)}
                      className="p-1.5 text-slate-400 hover:text-vapor-lavender transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      id={`delete-event-${event._id}`}
                      onClick={() => deleteMutation.mutate(event._id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {event.date ? new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No date set"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {event.guestCount || 0} guests
                  </div>
                  {event.location && (
                    <p className="text-xs text-slate-500 truncate">📍 {event.location}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <EventModal
          onClose={() => setShowModal(false)}
          onSave={(data) => createMutation.mutate(data)}
        />
      )}
      {editEvent && (
        <EventModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onSave={(data) => updateMutation.mutate({ id: editEvent._id, data })}
        />
      )}
    </div>
  );
}
