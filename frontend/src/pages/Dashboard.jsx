import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Calendar, Users, Trash2, Edit3, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";

const STATUS_CONFIG = {
  planning: { label: "Planning", color: "#FFD933", bgClass: "bg-oatly-yellow", icon: Clock },
  active: { label: "Active", color: "#A4CBA3", bgClass: "bg-oatly-green", icon: CheckCircle },
  completed: { label: "Completed", color: "#FFB0C2", bgClass: "bg-oatly-pink", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "#FF6B6B", bgClass: "bg-[#FF6B6B]", icon: AlertCircle },
};

function EventModal({ event, onClose, onSave }) {
  const [form, setForm] = useState(
    event || { title: "", date: "", venue: "", description: "", status: "planning", type: "social", expectedGuests: 20 }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return toast.error("Title and date are required");
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="brutal-card bg-white w-full max-w-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
          <h2 className="font-heading text-2xl text-black uppercase">{event ? "Edit Event" : "Create Event"}</h2>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white hover:bg-oatly-pink transition-colors shadow-[2px_2px_0px_#000]"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-heading uppercase text-black mb-1.5">Event Title *</label>
            <input
              id="event-name-input"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Wedding Ceremony"
              className="input-brutal w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Date *</label>
              <input
                id="event-date-input"
                type="date"
                value={form.date ? form.date.slice(0, 10) : ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-brutal w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-heading uppercase text-black mb-1.5">Status</label>
              <select
                id="event-status-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-brutal w-full bg-white cursor-pointer"
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-heading uppercase text-black mb-1.5">Venue</label>
            <input
              id="event-location-input"
              type="text"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="e.g. Grand Ballroom, Mumbai"
              className="input-brutal w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-heading uppercase text-black mb-1.5">Description</label>
            <textarea
              id="event-description-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the event..."
              rows={3}
              className="input-brutal w-full resize-none"
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="btn-brutal bg-white w-full py-2.5">Cancel</button>
            <button type="submit" className="btn-brutal btn-brutal-pink w-full py-2.5">{event ? "Save Changes" : "Create Event"}</button>
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
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to create event";
      toast.error(msg);
    },
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
    { label: "Total Events", value: events.length, color: "bg-white" },
    { label: "Active", value: events.filter((e) => e.status === "active").length, color: "bg-oatly-green" },
    { label: "Planning", value: events.filter((e) => e.status === "planning").length, color: "bg-oatly-yellow" },
    { label: "Completed", value: events.filter((e) => e.status === "completed").length, color: "bg-oatly-pink" },
  ];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b-3 border-black pb-6">
        <div>
          <h1 className="font-heading text-4xl text-black uppercase mb-1">Dashboard</h1>
          <p className="font-body font-bold text-black/60">Manage and track all your events</p>
        </div>
        <button
          id="create-event-btn"
          onClick={() => setShowModal(true)}
          className="btn-brutal btn-brutal-pink flex items-center gap-2 py-2.5 px-5"
        >
          <Plus className="w-5 h-5 text-black" />
          New Event
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

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="brutal-card p-6 bg-white animate-pulse">
              <div className="h-5 bg-black/10 rounded mb-3 w-3/4" />
              <div className="h-4 bg-black/5 rounded mb-2 w-1/2" />
              <div className="h-4 bg-black/5 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="brutal-card bg-white p-12 text-center">
          <div className="w-16 h-16 bg-oatly-pink border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-8 h-8 text-black" />
          </div>
          <h3 className="font-heading text-2xl text-black uppercase mb-2">No events yet</h3>
          <p className="font-body font-bold text-black/60 mb-6">Create your first event to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-brutal btn-brutal-blue flex items-center gap-2 mx-auto px-6 py-2.5"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => {
            const status = STATUS_CONFIG[event.status] || STATUS_CONFIG.planning;
            const StatusIcon = status.icon;
            return (
              <div key={event._id} className="brutal-card bg-white p-6 transition-all duration-150 flex flex-col justify-between h-56">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-heading text-xl text-black uppercase truncate pr-2 flex-1 leading-tight">{event.title}</h3>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        id={`edit-event-${event._id}`}
                        onClick={() => setEditEvent(event)}
                        className="p-1.5 border-2 border-black bg-white hover:bg-oatly-blue transition-colors shadow-[2px_2px_0px_#000]"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4 text-black" />
                      </button>
                      <button
                        id={`delete-event-${event._id}`}
                        onClick={() => deleteMutation.mutate(event._id)}
                        className="p-1.5 border-2 border-black bg-white hover:bg-[#FF6B6B] transition-colors shadow-[2px_2px_0px_#000]"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-black font-body font-bold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-black/50" />
                      <span>
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "No date set"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-black/50" />
                      <span>{event.expectedGuests || 0} guests</span>
                    </div>
                    {event.venue && (
                      <div className="text-xs text-black/60 truncate">
                        📍 {event.venue}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border-2 border-black ${status.bgClass} text-xs font-heading uppercase text-black shadow-[2px_2px_0px_#000]`}>
                    <StatusIcon className="w-3.5 h-3.5 text-black" />
                    {status.label}
                  </span>
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
