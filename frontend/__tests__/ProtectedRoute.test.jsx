// frontend/__tests__/ProtectedRoute.test.jsx
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../src/components/ProtectedRoute.jsx";
import { AuthProvider } from "../src/context/AuthContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock a simple component to render inside the protected route
const Secret = () => <div data-testid="secret">Secret Content</div>;

describe("ProtectedRoute", () => {
  test("redirects unauthenticated users to /login", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <Secret />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    // Should render the login page, not the secret
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});
