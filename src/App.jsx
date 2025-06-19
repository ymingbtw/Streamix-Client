import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import Navbar from "./pages/components/Navbar.jsx";
import { AliveScope } from "react-activation";
import { AnimatePresence } from "framer-motion";

const Register = React.lazy(() => import("./pages/Register"));
const Signin = React.lazy(() => import("./pages/Signin"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Watch = React.lazy(() => import("./pages/Watch"));
const MovieDashboard = React.lazy(() => import("./pages/MovieDashboard"));
const HomeWrapper = React.lazy(() => import("./pages/components/HomeWrapper"));
const Admin = React.lazy(() => import("./pages/components/Admin"));
const BrowseWrapper = React.lazy(() =>
  import("./pages/components/BrowseWrapper")
);

export default function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/signin", "/register", "/dashboard/m", "/profile"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);
  console.log("app rendered");
  return (
    <BrowserRouter>
      <AliveScope>
        {showNavbar && <Navbar />}
        <Suspense fallback={null}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <ProtectedRoute>
                      <HomeWrapper />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/browse"
                element={
                  <>
                    <ProtectedRoute>
                      <BrowseWrapper />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watch/:id"
                element={
                  <ProtectedRoute>
                    <Watch />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<Signin />} />
              <Route
                path="/dashboard/m"
                element={
                  <Admin>
                    <MovieDashboard />
                  </Admin>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </AliveScope>
    </BrowserRouter>
  );
}
