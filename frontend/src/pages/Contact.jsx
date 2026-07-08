import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Send, Sparkles, AlertCircle, CheckCircle, Smile } from "lucide-react";
import api from "../services/api";

const Contact = () => {
  // Question Form State
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState({ success: null, message: "" });

  // Feedback State
  const [feedback, setFeedback] = useState({ emoji: "", comment: "" });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState({ success: null, message: "" });

  // AI Chat Bot State
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am the ReuseHub Eco-Bot. Ask me anything about waste management, recycling, marketplace demands, listings, or how to earn certificates!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const emojis = [
    { label: "Angry", value: "😠" },
    { label: "Sad", value: "🙁" },
    { label: "Neutral", value: "😐" },
    { label: "Happy", value: "🙂" },
    { label: "Love it", value: "😍" },
  ];

  const suggestedQuestions = [
    "How does the AI matchmaker work?",
    "What materials can I list on ReuseHub?",
    "How do I claim a recycling certificate?",
    "Is listing waste free on this platform?",
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle Question Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;
    setFormLoading(true);
    setFormStatus({ success: null, message: "" });

    try {
      const response = await api.post("/contact/inquiry", formData);
      setFormStatus({ success: true, message: response.data.message });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setFormStatus({
        success: false,
        message: error.response?.data?.message || "Failed to submit inquiry. Please try again.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Feedback Submit
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.emoji) {
      setFeedbackStatus({ success: false, message: "Please select an emoji first!" });
      return;
    }
    setFeedbackLoading(true);
    setFeedbackStatus({ success: null, message: "" });

    let userId = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        userId = JSON.parse(userStr)._id;
      }
    } catch (err) {
      console.warn("Could not parse user ID for feedback", err);
    }

    try {
      const response = await api.post("/contact/feedback", {
        emoji: feedback.emoji,
        comment: feedback.comment,
        userId,
      });
      setFeedbackStatus({ success: true, message: response.data.message });
      setFeedback({ emoji: "", comment: "" });
    } catch (error) {
      setFeedbackStatus({
        success: false,
        message: error.response?.data?.message || "Failed to save feedback.",
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Simulated Eco-Bot response logic
  const handleBotResponse = (userText) => {
    setIsTyping(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "I'm still learning about that! You can submit an official inquiry form on this page and our support team will get back to you shortly.";

      if (lower.includes("match") || lower.includes("score")) {
        reply = "Our AI matchmaking engine runs automatically whenever you visit the Matches page, raise a demand, or post a new listing. It scores matches based on Waste Category similarity and Location proximity. Once a score is 60% or higher, a match is instantly generated!";
      } else if (lower.includes("certificate") || lower.includes("claim") || lower.includes("pdf")) {
        reply = "You earn carbon credit / green certificates for successfully completed exchanges! Go to the 'Certificate' tab in your account navigation to view, generate, or download your official ReuseHub certificate PDF.";
      } else if (lower.includes("free") || lower.includes("cost") || lower.includes("price")) {
        reply = "Yes! Listing your industrial or commercial waste materials is 100% free on ReuseHub. We want to encourage circular economy practices and divert waste from landfills.";
      } else if (lower.includes("material") || lower.includes("category") || lower.includes("waste")) {
        reply = "You can list various industrial materials including Plastics, Metals, Organics, Electronics (e-waste), Construction debris, Glass, Paper & Cardboard, and Textiles.";
      } else if (lower.includes("demand") || lower.includes("seeker") || lower.includes("buyer")) {
        reply = "Buyers and seekers can 'Raise a Demand' specifying the material, category, required quantity, and location. This allows suppliers to instantly match with you if they have matching waste.";
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        reply = "Hello! 👋 How can I help you today? Feel free to ask about recycling, matches, or certificates!";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setChatInput("");
    handleBotResponse(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDF4EA]/30 to-slate-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <h1 className="text-4xl font-extrabold text-slate-900 mt-3 sm:text-5xl">
              How can we help you?
            </h1>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
              Ask questions or leave emoji feedback regarding your experience with ReuseHub.
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">

          {/* Ask Questions Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#EDF4EA] text-[#4A7538] rounded-2xl">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ask Us a Question</h2>
                <p className="text-sm text-slate-500">We'll respond to your email address within 24 hours.</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="E.g., Matchmaking Issue, Feature Suggestion"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us details about what you need help with..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] transition resize-none"
                />
              </div>

              {formStatus.message && (
                <div
                  className={`p-4 rounded-xl flex items-start gap-2 text-sm font-medium border ${formStatus.success
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                >
                  {formStatus.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-[#4A7538] hover:bg-[#5B8A46] text-white py-3 px-6 rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {formLoading ? "Submitting..." : "Send Inquiry"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>

          {/* Leave Emoji Feedback */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Smile className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">How was your experience?</h2>
                <p className="text-sm text-slate-500">Select an emoji and share your thoughts to help us improve.</p>
              </div>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Emoji Selectors */}
              <div className="flex justify-around items-center max-w-md mx-auto py-2">
                {emojis.map((em) => {
                  const isSelected = feedback.emoji === em.value;
                  return (
                    <button
                      key={em.value}
                      type="button"
                      onClick={() => setFeedback({ ...feedback, emoji: em.value })}
                      className={`text-4xl p-2 rounded-2xl transition-all duration-200 transform hover:scale-125 ${isSelected
                          ? "bg-[#EDF4EA] border-2 border-[#4A7538] scale-110 shadow-sm"
                          : "opacity-60 hover:opacity-100 filter grayscale-[20%] hover:grayscale-0"
                        }`}
                    >
                      {em.value}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Optional Comments</label>
                <textarea
                  rows={2}
                  value={feedback.comment}
                  onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                  placeholder="Anything else you'd like to share?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A7538] focus:border-[#4A7538] transition resize-none"
                />
              </div>

              {feedbackStatus.message && (
                <div
                  className={`p-4 rounded-xl flex items-start gap-2 text-sm font-medium border ${feedbackStatus.success
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                >
                  {feedbackStatus.success ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  <span>{feedbackStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={feedbackLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-6 rounded-xl font-bold transition flex justify-center items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {feedbackLoading ? "Saving..." : "Submit Rating"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
