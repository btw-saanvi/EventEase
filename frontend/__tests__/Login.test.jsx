// frontend/__tests__/Login.test.jsx
import { vi, describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../src/pages/Login.jsx";
import { AuthProvider } from "../src/context/AuthContext";
import { BrowserRouter } from "react-router-dom";

// Mock the toast to avoid console errors
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@react-oauth/google", () => ({
  useGoogleLogin: () => vi.fn(),
  GoogleOAuthProvider: ({ children }) => children,
}));

describe("Login component", () => {
  const renderWithProviders = () =>
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

  test("shows validation errors when submitting empty form", async () => {
    renderWithProviders();
    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
