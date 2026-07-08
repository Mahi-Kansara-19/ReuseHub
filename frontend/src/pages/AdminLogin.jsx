import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { loginUser } from "../services/authService";
import reusehubLogo from "../assets/Reusehub_logo_.png";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData);
      const loggedInUser = response.data.user;

      const allowedAdmins = [
        "mahi.kansara1904@gmail.com",
        "rishikashah2674@gmail.com",
      ];

      if (
        loggedInUser.role !== "admin" ||
        !allowedAdmins.includes(loggedInUser.email)
      ) {
        navigate("/get-started");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <Link to="/" className="block mb-5">
              <img
                src={reusehubLogo}
                alt="ReuseHub Logo"
                className="h-26 w-26 object-contain mx-auto mb-0"
              />

              <h2 className="text-3xl font-extrabold text-slate-900 text-center">
                Reuse<span className="text-[#4A7538]">Hub</span>
              </h2>
            </Link>

            <span className="inline-block text-[18px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-md bg-[#EDF4EA] text-[#4A7538] mb-2">
              Admin Login
            </span>

          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                Admin Email
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="admin@reusehub.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#4A7538] focus:ring-1 focus:ring-[#4A7538]/20 text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#4A7538] focus:ring-1 focus:ring-[#4A7538]/20 text-slate-800 font-medium placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex justify-center items-center gap-2 bg-[#4A7538] hover:bg-[#5B8A46] text-white font-bold py-3.5 px-4 rounded-xl shadow-sm text-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              <span>{loading ? "Checking Access..." : "Login as Admin"}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-medium text-slate-500">
            Not an admin?{" "}
            <Link
              to="/get-started"
              className="font-extrabold text-[#4A7538] hover:underline"
            >
              Go to business login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;