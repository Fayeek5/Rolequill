import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import ProtectedRoute from "../auth/ProtectedRoute";
import Home from "../pages/Home";
import SavedJobs from "../pages/SavedJobs";
import AtsEngine from "../pages/AtsEngine";
import LatexBuilder from "../pages/LatexBuilder";
import FreelanceHub from "../pages/FreelanceHub";
import NetworkGraph from "../pages/NetworkGraph";
import ApplicationTracker from "../pages/ApplicationTracker";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Notifications from "../pages/Notifications";
import Login from "../pages/Login";

const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/saved", element: <SavedJobs /> },
  { path: "/ats", element: <AtsEngine /> },
  { path: "/latex", element: <LatexBuilder /> },
  { path: "/freelance", element: <FreelanceHub /> },
  { path: "/network", element: <NetworkGraph /> },
  { path: "/tracker", element: <ApplicationTracker /> },
  { path: "/settings", element: <Settings /> },
  { path: "/profile", element: <Profile /> },
  { path: "/notifications", element: <Notifications /> },
];

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
