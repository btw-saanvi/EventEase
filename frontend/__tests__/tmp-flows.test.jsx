// TEMPORARY flow inspection test — deleted after diagnosis
import { describe, test, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";

const get = vi.fn();
const post = vi.fn();
const put = vi.fn();
const del = vi.fn();

vi.mock("../src/lib/api", () => ({
  default: {
    get: (...a) => get(...a),
    post: (...a) => post(...a),
    put: (...a) => put(...a),
    delete: (...a) => del(...a),
  },
}));

import Budget from "../src/pages/Budget.jsx";
import Reviews from "../src/pages/Reviews.jsx";

const renderWith = (ui) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  get.mockReset(); post.mockReset(); put.mockReset(); del.mockReset();
  post.mockResolvedValue({ data: {} });
  put.mockResolvedValue({ data: {} });
  del.mockResolvedValue({ data: {} });
});

describe("Budget add-expense flow", () => {
  test("captures payload sent to POST /budget/expenses", async () => {
    get.mockImplementation((url) => {
      if (url === "/events")
        return Promise.resolve({ data: { events: [{ _id: "evt1", title: "Test Event", date: "2026-01-01" }] } });
      if (url === "/budget")
        return Promise.resolve({ data: { expenses: [] } });
      return Promise.resolve({ data: {} });
    });
    const user = userEvent.setup();
    renderWith(<Budget />);

    await user.click(await screen.findByRole("button", { name: /Add Expense/i }));
    await user.type(document.querySelector("#expense-description"), "Backyard lighting");
    await user.type(document.querySelector("#expense-amount"), "4500");
    const submit = screen.getAllByRole("button", { name: /Add Expense/i }).pop();
    await user.click(submit);

    await waitFor(() => expect(post).toHaveBeenCalled());
    console.log("BUDGET POST ->", post.mock.calls[0][0], JSON.stringify(post.mock.calls[0][1]));
  });
});

describe("Reviews add-review flow", () => {
  test("captures payload sent to POST /reviews", async () => {
    get.mockImplementation((url) => {
      if (url === "/events") return Promise.resolve({ data: { events: [] } });
      if (url === "/reviews") return Promise.resolve({ data: { reviews: [] } });
      return Promise.resolve({ data: {} });
    });
    const user = userEvent.setup();
    renderWith(<Reviews />);

    await user.click(await screen.findByRole("button", { name: /Write Review/i }));
    await user.type(document.querySelector("#review-vendor"), "Royal Caterers");
    await user.type(document.querySelector("#review-body"), "Great food and service");
    await user.click(screen.getByRole("button", { name: /Submit Review/i }));

    await waitFor(() => expect(post).toHaveBeenCalled());
    console.log("REVIEWS POST ->", post.mock.calls[0][0], JSON.stringify(post.mock.calls[0][1]));
  });
});