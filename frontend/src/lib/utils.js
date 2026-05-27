import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const EVENT_STATUS_COLORS = {
  planning: "badge-lavender",
  confirmed: "badge-green",
  completed: "badge-cyan",
  cancelled: "badge-red",
};

export const RSVP_COLORS = {
  confirmed: "badge-green",
  pending: "badge-yellow",
  declined: "badge-red",
};

export const EXPENSE_CATEGORIES = [
  { value: "venue", label: "Venue", color: "#818cf8" },
  { value: "catering", label: "Catering", color: "#67e8f9" },
  { value: "decoration", label: "Decoration", color: "#f0abfc" },
  { value: "photography", label: "Photography", color: "#c4b5fd" },
  { value: "entertainment", label: "Entertainment", color: "#a5f3fc" },
  { value: "transport", label: "Transport", color: "#fbbf24" },
  { value: "attire", label: "Attire", color: "#4ade80" },
  { value: "invitations", label: "Invitations", color: "#f87171" },
  { value: "misc", label: "Miscellaneous", color: "#94a3b8" },
];
