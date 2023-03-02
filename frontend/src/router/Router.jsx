import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
const Authentication = lazy(() => import("../pages/Authentication"));
const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner asOverlay />}>
        {localStorage.getItem("expiresIn") && localStorage.getItem("token") ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Authentication />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
