import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute  from "./components/auth/AdminRoute";
import AuthPage    from "./components/auth/AuthPage";
import Dashboard   from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import AdminPage   from "./pages/AdminPage";

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"   element={<AuthPage />} />
          <Route path="/"        element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/admin"   element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="*"        element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;