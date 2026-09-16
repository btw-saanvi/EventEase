// TEMPORARY end-to-end DOM test: does an added expense actually appear in the UI?
import { describe, test, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// In-memory "server" that accumulates expenses, like the real API does.
const expenses = [{ _id: "e1", eventId: "evt1", description: "decor", category: "Decoration", amount: 1000 }];
const post = vi.fn(async (url, body) => {
  if (url === "/budget/expenses") {
    expenses.push({ _id: "e" + (expenses.length + 1), ...body });
    return { data: { expenses } };
  }
  return { data: {} };
});
const get = vi.fn(async (url) => {
  if (url === "/events") return { data: { events: [{ _id: "evt1", title: "Birthday Party", date: "2026-09-16" }] } };
  if (url === "/budget") return { data: { totalBudget: 7000, expenses } };
  return { data: {} };
});

vi.mock("../src/lib/api", () => ({
  default: {
    get: (...a) => get(...a),
    post: (...a) => post(...a),
    put: vi.fn(async () => ({ data: {} })),
    delete: vi.fn(async () => ({ data: {} })),
  },
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import Budget from "../src/pages/Budget.jsx";

describe("Budget end-to-end add expense", () => {
  test("shows the newly added expense after refetch", async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter><Budget /></MemoryRouter>
      </QueryClientProvider>
    );

    console.log("BEFORE: is 'decor' visible?", !!screen.queryByText("decor"));

    await user.click(await screen.findByRole("button", { name: /Add Expense/i }));
    await user.type(document.querySelector("#expense-description"), "balloon arch");
    await user.type(document.querySelector("#expense-amount"), "1500");
    await user.click(screen.getAllByRole("button", { name: /Add Expense/i }).pop());

    await waitFor(() => expect(post).toHaveBeenCalled());
    console.log("POST body:", JSON.stringify(post.mock.calls[0][1]));

    // give react-query time to refetch + rerender
    await new Promise((r) => setTimeout(r, 600));
    console.log("AFTER: is 'balloon arch' visible?", !!screen.queryByText("balloon arch"));
    console.log("AFTER: is 'decor' visible?", !!screen.queryByText("decor"));
    console.log("GET /budget call count:", get.mock.calls.filter((c) => c[0] === "/budget").length);
    console.log("modal still open?", !!document.querySelector("#expense-description"));
    expect(screen.queryByText("balloon arch")).toBeTruthy();
  });
});