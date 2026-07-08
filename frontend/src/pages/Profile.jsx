import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProfile, updateProfile, changePassword } from "../services/authService";
import {
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Layers,
  CheckCircle,
  AlertCircle,
  Lock,
} from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    businessCategory: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile({
          businessName: response.data.businessName || "",
          ownerName: response.data.ownerName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          businessCategory: response.data.businessCategory || "",
          location: response.data.location || "",
        });
      } catch (err) {
        setError("Failed to fetch business profile from server");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await updateProfile(profile);
      setMessage(response.data.message || "Profile updated successfully");

      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Profile update failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityMessage("");
    setSecurityError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setSecurityError("New passwords do not match");
      return;
    }

    setSecurityLoading(true);

    try {
      const response = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setSecurityMessage(response.data.message || "Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setSecurityError(
        err.response?.data?.message || "Failed to update password. Please check your current password."
      );
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header title */}
      <div className="mb-10 text-center">
        

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Settings
        </h1>
      </div>

      {/* Main Settings Body */}
      <div className="flex flex-col items-center gap-8">
        {/* Card 1: Business Identity */}
        <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Business Identity
            </h2>

            <p className="text-xs text-slate-400 font-semibold mt-1">
              Manage corporate details, listing metadata, and trading contacts.
            </p>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-emerald-800 text-sm font-semibold"
            >
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <span>{message}</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-rose-800 text-sm font-semibold"
            >
              <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                  Corporate Name
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    name="businessName"
                    value={profile.businessName}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                  Managing Director / Owner
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    name="ownerName"
                    value={profile.ownerName}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                  Registered Email Address (Locked)
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
                    <Mail className="h-4 w-4" />
                  </div>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="pl-10 w-full rounded-xl border border-slate-200/60 bg-slate-100 px-4 py-2.5 text-sm cursor-not-allowed text-slate-400 font-semibold"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                  Corporate Phone
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                  Operations Category
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Layers className="h-4 w-4" />
                  </div>

                  <select
                    name="businessCategory"
                    value={profile.businessCategory}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="">Select Category</option>

                    {businessCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                  Primary Trading City / Hub
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center items-center bg-[#4A7538] hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm text-sm transition-all focus:outline-none disabled:opacity-50 hover:-translate-y-0.5"
              >
                {loading ? "Saving Credentials..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Security & Password */}
        <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Security & Credentials
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Change your password securely. No email validation is required here.
            </p>
          </div>

          {securityMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-emerald-800 text-sm font-semibold"
            >
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <span>{securityMessage}</span>
            </motion.div>
          )}

          {securityError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-rose-800 text-sm font-semibold"
            >
              <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
              <span>{securityError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSecuritySubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="pl-10 w-full rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit Password Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={securityLoading}
                className="inline-flex justify-center items-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm text-sm transition-all focus:outline-none disabled:opacity-50 hover:-translate-y-0.5"
              >
                {securityLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;