import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";
import { loginUser, googleLogin } from "../services/authService";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role") || "business";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check for query parameters token & user (Passport Google callback redirect flow)
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(parsedUser));
        navigate("/dashboard");
      } catch (err) {
        console.error("Redirect login parsing error:", err);
        setError("Google redirect authentication failed.");
      }
    }
  }, [searchParams, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const idToken = credentialResponse.credential;
      const response = await googleLogin(idToken);
      const loggedInUser = response.data.user;

      if (loggedInUser.role === "admin") {
        setError("Admin users must login through the admin portal.");
        return;
      }

      try {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      } catch (e) {
        console.warn("Failed to write to localStorage:", e);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setError("Google Sign-In was unsuccessful. Try again later.");
  };

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

// Prevent admin from logging in through normal login page
if (loggedInUser.role === "admin") {
  setError("Admin users must login through the admin portal.");
  return;
}

try {
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(loggedInUser));
} catch (e) {
  console.warn("Failed to write to localStorage:", e);
}

navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Screen - Visual Showcase */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-emerald-950 via-emerald-900 to-teal-900 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        {/* Branding header */}
        <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-xl z-10">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
            <Leaf className="h-5 w-5 text-emerald-400" />
          </div>
          <span>Reuse<span className="text-emerald-400">Hub</span></span>
        </Link>

        {/* Core content */}
        <div className="my-auto z-10 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase mb-6">
              Verified B2B Exchange
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Powering Circular Commerce
            </h2>
            <p className="text-emerald-100/80 text-sm leading-relaxed mb-6 font-medium">
              Join thousands of businesses saving thousands of tons of wood, paper, textile, and plastic scrap from landfills annually.
            </p>
          </motion.div>

          <div className="space-y-4 border-t border-emerald-800/60 pt-6">
            <div className="flex items-center space-x-3 text-xs font-semibold text-emerald-200">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Audited CO₂ emission reporting models</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold text-emerald-200">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Encrypted local trading contacts</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-[11px] font-semibold text-emerald-300/60">
          © {new Date().getFullYear()} ReuseHub Inc. All rights reserved.
        </div>
      </div>

      {/* Right Screen - LoginForm */}
      <div className="lg:col-span-7 bg-slate-50 flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
            <div className="mb-8">
              <span className="inline-block text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-md uppercase bg-primary/10 text-primary mb-2">
                Portal Sign-In
              </span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                Welcome back to ReuseHub
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Accessing console as: <span className="font-extrabold text-slate-600 uppercase">{selectedRole === "buyer" ? "Buyer" : selectedRole === "supplier" ? "Supplier" : "Business"}</span>
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                  Corporate Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
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
                    className="pl-10 pr-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex justify-center items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                <span>{loading ? "Authorizing Security..." : "Login to Console"}</span>
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase">
                <span className="bg-white px-3 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <div className="w-full max-w-[400px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  theme="outline"
                  size="large"
                  width="368px"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            </div>

            <div className="mt-6 text-center text-xs font-medium text-slate-500">
              New to ReuseHub?{" "}
              <Link to="/register" className="font-extrabold text-primary hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;