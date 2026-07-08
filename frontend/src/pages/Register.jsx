import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Leaf, ArrowRight, ShieldCheck, User, Building, Phone, MapPin, Mail, Lock } from "lucide-react";
import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlRole = searchParams.get("role");

const [selectedRole, setSelectedRole] = useState(
  urlRole || ""
);

  const [formData, setFormData] = useState({
  businessName: "",
  ownerName: "",
  email: "",
  password: "",
  phone: "",
  businessCategory: "",
  location: "",
  accountType: urlRole || "",
});

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const businessCategories = [
    "Cafe and Restaurant",
    "Plastic Waste",
  "Paper Waste",
  "Metal Waste",
  "Glass Waste",
  "E-Waste",
  "Textile Waste",
  "Food Waste",
  "Wood Waste",
  "Rubber Waste",
  "Construction Waste",
  "Chemical Waste",
  "Printing Shop",
  "Packaging Waste",
  "Flower Waste",
  "Agricultural Waste",
  "Other",
  ];

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

    console.log("Submitting registration payload:", formData);

    try {
      if (!formData.accountType) {
  setError("Please select Buyer or Supplier");
  setLoading(false);
  return;
}
      const response = await registerUser(formData);
      console.log("Registration successful response:", response.data);

      try {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (e) {
        console.warn("Failed to write to localStorage:", e);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Registration API error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please check your inputs.";
      setError(errorMessage);
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
              Green Onboarding
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Start Sourcing & Listing Waste
            </h2>
            <p className="text-emerald-100/80 text-sm leading-relaxed mb-6 font-medium">
              Create a free business profile, browse commercial scrap listings, and instantly coordinate transfers. Join the circular economy.
            </p>
          </motion.div>

          <div className="space-y-4 border-t border-emerald-800/60 pt-6">
            <div className="flex items-center space-x-3 text-xs font-semibold text-emerald-200">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Free registration and zero monthly overheads</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold text-emerald-200">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Direct communication with local businesses</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-[11px] font-semibold text-emerald-300/60">
          © {new Date().getFullYear()} ReuseHub Inc. All rights reserved.
        </div>
      </div>

      {/* Right Screen - RegisterForm */}
      <div className="lg:col-span-7 bg-slate-50 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full"
        >
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <div className="mb-6">
              <span className="inline-block text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-md uppercase bg-primary/10 text-primary mb-2">
                Portal Registration
              </span>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                Create your ReuseHub account
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Registering corporate profile as: <span className="font-extrabold text-slate-600 uppercase">{selectedRole
 ? selectedRole.toUpperCase()
 : "SELECT ACCOUNT TYPE"}</span>
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
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Account Type */}
<div>
  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
    Register As
  </label>

  <div className="grid grid-cols-2 gap-4">

    <button
      type="button"
      onClick={() => {
        setSelectedRole("buyer");
        setFormData({
          ...formData,
          accountType: "buyer",
        });
      }}
      className={`py-3 rounded-xl font-bold border transition ${
        selectedRole === "buyer"
          ? "bg-primary text-white border-primary"
          : "bg-white text-slate-700 border-slate-200"
      }`}
    >
      Buyer
    </button>


    <button
      type="button"
      onClick={() => {
        setSelectedRole("supplier");
        setFormData({
          ...formData,
          accountType: "supplier",
        });
      }}
      className={`py-3 rounded-xl font-bold border transition ${
        selectedRole === "supplier"
          ? "bg-primary text-white border-primary"
          : "bg-white text-slate-700 border-slate-200"
      }`}
    >
      Supplier
    </button>

  </div>
</div>
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Business Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="businessName"
                      placeholder="e.g. Apex Packagers"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Owner / Contact Person
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="ownerName"
                      placeholder="e.g. Anil Sharma"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                    />
                  </div>
                </div>
              </div>

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
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
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
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
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

              {/* Grid 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                    Business Category
                  </label>
                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="" className="text-slate-400 font-bold">Select Category</option>
                    {businessCategories.map((category) => (
                      <option key={category} value={category} className="text-slate-800 font-semibold">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                  Location / City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex justify-center items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                <span>{loading ? "Registering Security..." : "Register Corporate Console"}</span>
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-6 text-center text-xs font-medium text-slate-500">
              Already registered?{" "}
              <Link to="/login" className="font-extrabold text-primary hover:underline">
                Sign in instead
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;