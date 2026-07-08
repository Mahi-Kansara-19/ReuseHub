import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import CreateListing from "./pages/CreateListing";
import Analytics from "./pages/Analytics";

import Listings from "./pages/Listings";
import AddListing from "./pages/AddListing";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import RaiseDemand from "./pages/RaiseDemand";
import ViewDemands from "./pages/ViewDemands";
import MyDemands from "./pages/MyDemands";

import Matches from "./pages/Matches";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import "./App.css";
import SupplierMatches from "./pages/SupplierMatches";
import Certificate from "./pages/Certificate";
import CertificateCard from "./components/CertificateCard";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";

const AppContent = () => {
  const location = useLocation();
  

  const hideNavbar = location.pathname.startsWith("/admin");
const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {!hideNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/listings" element={<Listings />} />

          <Route path="/raise-demand" element={<RaiseDemand />} />
          <Route path="/demands" element={<ViewDemands />} />
          <Route path="/my-demands" element={<MyDemands />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/contact" element={<Contact />} />
  

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <Admin />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
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
            path="/create-listing"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-listing"
            element={
              <ProtectedRoute>
                <AddListing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-listings"
            element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-listing/:id"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }
          />

          <Route

path="/matches"

element={

<ProtectedRoute>

{user?.accountType === "supplier"

? <SupplierMatches />

: <Matches />}

</ProtectedRoute>

}

/>

          

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;