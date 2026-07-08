import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Plus,
  LayoutDashboard,
  ShoppingBag,
  LineChart,
} from "lucide-react";
import logo from "../assets/Reusehub_logo_.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [demandDropdown, setDemandDropdown] = useState(false);

  let token = null;
  let user = null;

  try {
    token = localStorage.getItem("token");
    const u = localStorage.getItem("user");

    if (u && u !== "undefined") {
      user = JSON.parse(u);
    }
  } catch (e) {
    console.warn("localStorage is blocked or corrupted:", e);
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }

    setUserDropdown(false);
    setIsOpen(false);
    navigate("/");
  };

  useEffect(() => {
    setIsOpen(false);
    setUserDropdown(false);
    setDemandDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const id = location.hash.substring(1);
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  const initials = user?.businessName
    ? user.businessName.substring(0, 2).toUpperCase()
    : "BU";

  const isActive = (path, hash = "") => {
    if (hash) {
      return location.pathname === path && location.hash === hash;
    }

    if (path === "/") {
      return location.pathname === "/" && !location.hash;
    }

    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 text-primary font-bold text-xl hover:opacity-90 transition-opacity"
          >
            <img
              src={logo}
              alt="ReuseHub Logo"
              className="h-14 w-14 object-contain"
            />

            <span className="font-extrabold text-slate-900 tracking-tight text-lg">
              Reuse<span className="text-primary">Hub</span>
            </span>
          </Link>

          <div className="hidden xl:flex space-x-5 items-center">
            <Link
              to="/"
              className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
                isActive("/") ? "text-primary" : "text-slate-600"
              }`}
            >
              <span>Home</span>
              {isActive("/") && (
                <motion.span
                  layoutId="activeNavUnderline"
                  className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            <a
              href="/#about"
              className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
                isActive("/", "#about") ? "text-primary" : "text-slate-600"
              }`}
            >
              <span>About Us</span>
              {isActive("/", "#about") && (
                <motion.span
                  layoutId="activeNavUnderline"
                  className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>

           {user?.accountType === "buyer" && (
  <Link
    to="/marketplace"
    className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
      isActive("/marketplace") ? "text-primary" : "text-slate-600"
    }`}
  >
    <span>Marketplace</span>
    {isActive("/marketplace") && (
      <motion.span
        layoutId="activeNavUnderline"
        className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-primary rounded-full"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </Link>
)}

            {user?.accountType === "supplier" && (
  <Link
    to="/listings"
    className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
      isActive("/listings") ? "text-primary" : "text-slate-600"
    }`}
  >
    <span>Listings</span>
    {isActive("/listings") && (
      <motion.span
        layoutId="activeNavUnderline"
        className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-primary rounded-full"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
  </Link>
)}

            <Link
              to="/matches"
              className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
                isActive("/matches") ? "text-primary" : "text-slate-600"
              }`}
            >
              <span>Matches</span>
              {isActive("/matches") && (
                <motion.span
                  layoutId="activeNavUnderline"
                  className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            {user?.accountType === "buyer" ? (
              <div className="relative">
                <button
                  onClick={() => setDemandDropdown(!demandDropdown)}
                  className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
                    isActive("/demands") ||
                    isActive("/raise-demand") ||
                    isActive("/my-demands")
                      ? "text-primary"
                      : "text-slate-600"
                  }`}
                >
                  Demands ▼
                </button>

                {demandDropdown && (
                  <div className="absolute left-0 mt-3 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                    <Link
                      to="/demands"
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      View Demands
                    </Link>
                    <Link
                      to="/raise-demand"
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      Raise Demand
                    </Link>
                    <Link
                      to="/my-demands"
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      My Demands
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/demands"
                className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
                  isActive("/demands") ? "text-primary" : "text-slate-600"
                }`}
              >
                <span>View Demands</span>
              </Link>
            )}

            {token && (
              <Link
                to="/analytics"
                className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
                  isActive("/analytics") ? "text-primary" : "text-slate-600"
                }`}
              >
                <span>Analytics</span>
                {isActive("/analytics") && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )}

            <Link
              to="/contact"
              className={`relative py-1 text-m font-semibold transition-colors duration-200 hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-slate-600"
              }`}
            >
              <span>Contact Us</span>
              {isActive("/contact") && (
                <motion.span
                  layoutId="activeNavUnderline"
                  className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                {user?.accountType === "supplier" && (
                  <Link
                    to="/add-listing"
                    className="inline-flex items-center space-x-1 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-3 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>List Waste</span>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center space-x-2 focus:outline-none bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl transition-all duration-200"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm border border-primary/20">
                      {initials}
                    </div>

                    <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                      {user?.businessName}
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                        userDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200/80 shadow-lg py-2 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">
                          Logged in as
                        </p>
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user?.ownerName}
                        </p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-primary/10 text-primary">
                          {user?.accountType}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Profile Settings</span>
                      </Link>

                      {user?.accountType === "supplier" && (
                        <Link
                          to="/my-listings"
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <ShoppingBag className="h-4 w-4 text-slate-400" />
                          <span>My Listings</span>
                        </Link>
                      )}

                      <Link
                        to="/matches"
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <LineChart className="h-4 w-4 text-slate-400" />
                        <span>Matches</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        <span>Console Dashboard</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 border-t border-slate-100 transition-colors text-left font-semibold"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/get-started"
                  className="bg-primary hover:bg-[#66994E] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-950 bg-slate-50 border border-slate-200 hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-300 py-4 px-4 space-y-2">
          <Link
            to="/"
            className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
              isActive("/")
               ? "bg-[#4A7538] text-white font-bold"
  : "text-slate-700 hover:bg-[#4A7538]/10 hover:text-[#4A7538]"
            }`}
          >
            Home
          </Link>

          <a
            href="/#about"
            className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
              isActive("/", "#about")
                ? "bg-primary/10 text-primary font-bold"
                : "text-slate-700 hover:bg-slate-50 hover:text-primary"
            }`}
          >
            About Us
          </a>

         {user?.accountType === "buyer" && (
  <Link
    to="/marketplace"
    className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
      isActive("/marketplace")
        ? "bg-primary/10 text-primary font-bold"
        : "text-slate-700 hover:bg-slate-50 hover:text-primary"
    }`}
  >
    Marketplace
  </Link>
)}

        {user?.accountType === "supplier" && (
  <Link
    to="/listings"
    className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
      isActive("/listings")
        ? "bg-primary/10 text-primary font-bold"
        : "text-slate-700 hover:bg-slate-50 hover:text-primary"
    }`}
  >
    Listings
  </Link>
)}
          <Link
            to="/matches"
            className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
              isActive("/matches")
                ? "bg-primary/10 text-primary font-bold"
                : "text-slate-700 hover:bg-slate-50 hover:text-primary"
            }`}
          >
            Matches
          </Link>

          <Link
            to="/demands"
            className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
              isActive("/demands")
                ? "bg-primary/10 text-primary font-bold"
                : "text-slate-700 hover:bg-slate-50 hover:text-primary"
            }`}
          >
            View Demands
          </Link>

          {user?.accountType === "buyer" && (
            <>
              <Link
                to="/raise-demand"
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive("/raise-demand")
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                Raise Demand
              </Link>

              <Link
                to="/my-demands"
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive("/my-demands")
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                My Demands
              </Link>
            </>
          )}

          {token && (
            <>
              <Link
                to="/dashboard"
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive("/dashboard")
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                Console Dashboard
              </Link>

              <Link
                to="/analytics"
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive("/analytics")
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                Analytics
              </Link>

              {user?.accountType === "supplier" && (
                <Link
                  to="/my-listings"
                  className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                    isActive("/my-listings")
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                  }`}
                >
                  My Listings
                </Link>
              )}


              <Link
                to="/profile"
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive("/profile")
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                Profile Settings
              </Link>
            </>
          )}

          <Link
            to="/contact"
            className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
              isActive("/contact")
                ? "bg-[#4A7538] text-white font-bold"
                : "text-slate-700 hover:bg-[#4A7538]/10 hover:text-[#4A7538]"
            }`}
          >
            Contact Us
          </Link>


          {token ? (
            <div className="pt-4 border-t border-slate-100 px-4 space-y-3">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm border border-primary/20">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {user?.businessName}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {user?.accountType}
                  </p>
                </div>
              </div>

              {user?.accountType === "supplier" && (
                
                <Link
                  to="/add-listing"
                  className="w-full inline-flex items-center justify-center space-x-1 bg-primary text-white text-sm font-bold py-2.5 rounded-xl shadow transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>List Waste</span>
                </Link>
              )}
               <NavLink
  to="/certificate"
  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-100"
>
  🏆 Certificate
</NavLink>


              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2.5 text-sm text-rose-600 hover:bg-rose-50 border border-rose-200/60 rounded-xl transition-colors font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 px-4 flex flex-col space-y-3">
              <Link
                to="/login"
                className="w-full text-center text-slate-700 hover:text-slate-900 border border-slate-200 font-semibold py-2.5 rounded-xl transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="w-full text-center bg-primary text-white font-bold py-2.5 rounded-xl shadow-sm transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;