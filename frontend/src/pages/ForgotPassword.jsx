import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ShieldCheck, ArrowLeft, KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Token & New Password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, message: "" });
  const [simulatedCode, setSimulatedCode] = useState(""); // Display reset code in UI for dev convenience

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus({ success: null, message: "" });

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setStatus({ success: true, message: response.data.message });
      if (response.data.simulated && response.data.token) {
        setSimulatedCode(response.data.token);
      } else {
        setSimulatedCode("");
      }
      setStep(2);
    } catch (error) {
      setStatus({
        success: false,
        message: error.response?.data?.message || "Failed to initiate password reset.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setStatus({ success: false, message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setStatus({ success: null, message: "" });

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setStatus({ success: true, message: response.data.message });
      setStep(3); // 3: Success Screen
    } catch (error) {
      setStatus({
        success: false,
        message: error.response?.data?.message || "Failed to reset password. Please check your reset code.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-2xl bg-[#EDF4EA] text-[#4A7538] flex items-center justify-center mx-auto mb-4">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Reset Password</h1>
          <p className="text-sm text-slate-500 mt-1">
            {step === 1 && "Enter your business email to get a simulated reset code."}
            {step === 2 && "Enter the 6-digit reset code and your new password."}
            {step === 3 && "Your password has been successfully updated!"}
          </p>
        </div>

        {/* Form Alerts */}
        {status.message && step !== 3 && (
          <div
            className={`p-4 rounded-xl flex items-start gap-2 text-sm font-semibold border mb-4 ${
              status.success
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {status.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleRequestToken}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] text-sm transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A7538] hover:bg-[#5B8A46] text-white py-3 rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? "Requesting..." : "Send Reset Code"}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition">
                  <ArrowLeft className="h-3 w-3" /> Back to Login
                </Link>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              {/* Development Convenience Banner */}
              {simulatedCode && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-800 text-center mb-2">
                  🛡️ Simulated email reset code: <span className="font-extrabold font-mono text-sm bg-white px-2 py-0.5 rounded border border-amber-300 ml-1">{simulatedCode}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reset Code</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit code"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] text-sm transition font-mono tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] text-sm transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A7538] hover:bg-[#5B8A46] text-white py-3 rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Save Password"}
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center py-4"
            >
              <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Success!</h2>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Your new password has been verified. You can now log in securely with your updated password.
              </p>
              
              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full inline-block text-center bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition shadow-sm"
                >
                  Return to Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
