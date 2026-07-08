import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Leaf, ArrowRight, PackageOpen, Award } from "lucide-react";

const GetStarted = () => {
  return (
    <div className="min-height-[calc(100vh-64px)] bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md text-center mb-12"
      >
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 uppercase tracking-wider">
          Circular Onboarding
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight leading-none mb-3">
          Join ReuseHub
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Choose how your business wants to trade. Connect, scale, and save CO₂ within a local closed-loop network.
        </p>
      </motion.div>

      {/* Role Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Buyer Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-950 mb-3 flex items-center">
              I am a Buyer
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
              Source low-cost, high-quality reusable materials (cardboard boxes, textile offcuts, organic compost, clean pallets) direct from local suppliers.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 font-medium mb-8">
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Access curated B2B marketplace lists</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Save up to 40% on packaging & raw materials</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Track verified carbon savings on purchases</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register?role=buyer"
              className="flex-1 inline-flex justify-center items-center space-x-2 bg-primary hover:bg-[#66994E] text-white font-bold py-3 px-4 rounded-xl shadow-sm text-sm transition-colors"
            >
              <span>Register as Buyer</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login?role=buyer"
              className="flex-1 text-center border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition-colors"
            >
              Log In
            </Link>
          </div>
        </motion.div>

        {/* Supplier Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 border border-accent/20">
              <PackageOpen className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-950 mb-3 flex items-center">
              I am a Supplier
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
              List and monetize your excess, offcuts, or reusable packaging waste. Turn your waste overheads into new B2B revenue and positive branding.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 font-medium mb-8">
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Post clean materials in under 2 minutes</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Reduce commercial trash removal costs</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Earn official platform circularity badges</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register?role=supplier"
              className="flex-1 inline-flex justify-center items-center space-x-2 bg-accent hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm text-sm transition-colors"
            >
              <span>Register as Supplier</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login?role=supplier"
              className="flex-1 text-center border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition-colors"
            >
              Log In
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Trust Seal */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex items-center space-x-2 text-xs font-semibold text-slate-400"
      >
        <Award className="h-4 w-4" />
        <span>Vetted B2B Sustainability Platform</span>
      </motion.div>
    </div>
  );
};

export default GetStarted;