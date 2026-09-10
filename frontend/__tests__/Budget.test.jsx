// frontend/__tests__/Budget.test.jsx
import { describe, test, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Budget from "../src/pages/Budget.jsx";
import { AuthProvider } from "../src/context/AuthContext";
import { BrowserRouter } from "react-router-dom";


// Mock API calls
vi.mock("../src/lib/api", () => ({
  get: vi.fn().mockImplementation((url) => {
    if (url === "/events") {
      return Promise.resolve({ data: { events: [{ _id: "event1", title: "Test Event", date: "2023-01-01" }] } });
    }
    if (url === "/budget") {
      return Promise.resolve({ data: { expenses: [
        { description: "Venue", category: "Venue", amount: 1000 },
        { description: "Catering", category: "Catering", amount: 2000 },
      ] } });
    }
    return Promise.resolve({ data: {} });
  }),
}));

const queryClient = new QueryClient();

describe("Budget component", () => {
  test("displays calculated total spent", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
    // Prepopulate query cache with events and budget data
    queryClient.setQueryData(['events'], { events: [{ _id: 'event1', title: 'Test Event', date: '2023-01-01' }] });
    queryClient.setQueryData(['budget', 'event1'], { expenses: [
      { description: 'Venue', category: 'Venue', amount: 1000 },
      { description: 'Catering', category: 'Catering', amount: 2000 }
    ] });
    const renderWithProviders = () =>
      render(
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <Budget />
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      );
    renderWithProviders();

    // Wait for total spent to appear
    const totalSpent = await screen.findByText(/₹\s?3,000/);
    expect(totalSpent).toBeInTheDocument();
  });
});
