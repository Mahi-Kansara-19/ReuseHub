import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Globe2,
  Building2,
  Recycle,
  Sparkles,
  Search,
  MessageSquare,
  AlignCenter
} from "lucide-react";


const Home = () => {
  const [stats, setStats] = useState({
    businessesRegistered: 0,
    wasteReused: 0,
    co2Saved: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/analytics/public");
        setStats(data);
      } catch (error) {
        console.log("Stats fetch error:", error);
      }
    };

    fetchStats();
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-slate-50 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-b from-slate-100/60 to-slate-50">
        {/* Soft background glow circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-6 uppercase tracking-wider"
              >
                <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                <span>Premium Circular Supply Chain</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6"
              >
                One Business&apos;s <span className="text-primary">Waste</span> Is Another&apos;s <span className="text-secondary">Resource</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                ReuseHub is the next-generation B2B circular exchange platform. Connect, negotiate, and exchange industrial wood, packaging, textiles, and organic waste locally. Turn compliance overheads into new B2B trade.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                {user?.accountType === "supplier" ? (
                  <Link
                    to="/add-listing"
                    className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <span>List Commercial Waste</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/raise-demand"
                    className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <span>Raise a Demand</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  <Search className="h-4 w-4 text-slate-500" />
                  <span>Explore Materials</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Graphics Panel */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full relative"
              >
                {/* Main Visual Image Card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                    alt="Sustainable recycling and reuse"
                    className="w-full h-64 sm:h-72 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent pointer-events-none" />
                </div>

                {/* Floating Micro-SaaS widgets */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -right-4 -bottom-6 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-lg z-20 hidden sm:block max-w-[220px]"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500">
                      <Recycle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Matches Found</h4>
                      <p className="text-[10px] text-slate-400 font-bold">Category: Packaging</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -left-6 -top-6 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-lg z-20 hidden sm:block max-w-[200px]"
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    <span className="text-xs font-extrabold text-slate-800">CO₂ Ledger Updated</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics */}
      <section className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md px-8 py-8 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Stat item 1 */}
            <div className="pt-6 md:pt-0">
              <span className="block text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
                {stats.businessesRegistered}+
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">
                Businesses Registered
              </span>
            </div>
            {/* Stat item 2 */}
            <div className="pt-6 md:pt-0">
              <span className="block text-4xl sm:text-5xl font-extrabold text-primary tracking-tight mb-2">
                {stats.wasteReused}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">
                Industrial Waste Reused
              </span>
            </div>
            {/* Stat item 3 */}
            <div className="pt-6 md:pt-0">
              <span className="block text-4xl sm:text-5xl font-extrabold text-secondary tracking-tight mb-2">
                {stats.co2Saved}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">
                CO₂ Emissions Offset
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bento Features Grid */}
      <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4 uppercase tracking-wider">
            Curated B2B Operations
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            A Clean Enterprise Waste Network
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
            Eliminate middle-man delays. ReuseHub connects local buyers and suppliers directly through structured listings, location maps, and audited carbon savings.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Supplier Waste Monetization
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              List cardboard offcuts, pallets, spent organic grounds, and clean industrial scraps. Clear warehouse storage, reduce commercial landfill haul charges, and boost green metrics.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Direct Sourcing for Buyers
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Filter commercial material lists by volume, pricing structure, and city. Access affordable packing or composting resources from local verified businesses.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Audited Carbon Ledgers
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Every successfully completed B2B transfer computes verified CO₂ offset values. Download instant ESG indicators for shareholder reports and board audits.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Supported Business Categories */}
      <section id="categories" className="py-16 sm:py-24 bg-slate-100/50 border-y border-slate-200/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
            <div className="max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary mb-4 uppercase tracking-wider">
                Industrial Sectors
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Sectors Active in the Loop
              </h2>
            </div>
            <Link to="/marketplace" className="hidden md:inline-flex items-center space-x-1.5 text-sm font-bold text-primary hover:text-emerald-600 transition-colors mt-4 md:mt-0">
              <span>View Category Marketplace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow transition-shadow group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80"
                  alt="Cafe and restaurant"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg">Cafés & Restaurants</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Trading: Organic Coffee Grounds, Scrap food waste, clean packaging crates.</p>
              </div>
            </div>

            {/* Category 2 */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow transition-shadow group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
                  alt="Textile shop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg">Textiles & Garments</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Trading: Cotton offcuts, scrap sewing rolls, cardboard center rolls.</p>
              </div>
            </div>

            {/* Category 3 */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow transition-shadow group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80"
                  alt="Workshop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg">Carpentry & Workshops</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Trading: Pine Wood Pallets, dry wood dust, scrap metal clamps.</p>
              </div>
            </div>

            {/* Category 4 */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow transition-shadow group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80"
                  alt="Packaging business"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg">Packaging & Logistics</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Trading: Double-wall corrugated shipping boxes, poly-wrapping scraps.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section id="why-us" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent mb-4 uppercase tracking-wider">
              Platform Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Why Corporate Networks Trust ReuseHub
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed mb-8">
              We design digital products that make B2B recycling effortless, highly transparent, and financially positive. By optimizing transit miles and packaging layers, we turn waste into valuable inputs.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-1 rounded-lg bg-emerald-50 mt-1" style={{ color: "#4A7538" }}>
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Audited Material Quality</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Suppliers provide clean description details, images, and moisture factors to maintain trade standards.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-1 rounded-lg bg-emerald-50 mt-1" style={{ color: "#4A7538" }}>
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Carbon Offset Audits</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Carbon indicators are calculated using international standards based on material type and weight offsets.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Illustration */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80">
              <img
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80"
                alt="Clean energy sustainability illustration"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-950 text-white relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 mb-4 uppercase tracking-wider" style={{ color: "#4A7538" }}>
              Client Validation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Validated by Sustainability Managers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <p className="text-slate-300 text-sm font-medium italic leading-relaxed mb-6">
                &ldquo;ReuseHub completely transformed our logistics packing overheads. We sourced 5,000 kg of corrugated cardboard boxes locally at zero material cost, saving 14 tons of carbon.&rdquo;
              </p>
              <div>
                <h4 className="font-extrabold text-sm" style={{ color: "#4A7538" }}>GreenCart Eco-Packaging</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Sourcing Manager, Mumbai</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <p className="text-slate-300 text-sm font-medium italic leading-relaxed mb-6">
                &ldquo;We used to pay commercial waste haulers to clear our textile cotton scraps. Now, craft shops collect them direct from our workshops, turning a waste expense into new brand trust.&rdquo;
              </p>
              <div>
                <h4 className="font-extrabold text-sm" style={{ color: "#4A7538" }}>Heritage Weaves Garments</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Managing Director, Ahmedabad</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <p className="text-slate-300 text-sm font-medium italic leading-relaxed mb-6">
                &ldquo;Sourcing organic waste for composting used to involve long transit distances. Finding local cafés with spent coffee grounds through active alerts has cut transit emissions by 60%.&rdquo;
              </p>
              <div>
                <h4 className="font-extrabold text-sm" style={{ color: "#4A7538" }}>BioFarm Composters</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Operations Lead, Pune</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) Section */}
      <section className="py-20 bg-gradient-to-tr from-emerald-950 to-slate-950 text-white relative text-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto relative z-10">
          <Leaf className="h-10 w-10 mx-auto mb-6" style={{ color: "#4A7538" }} />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Ready to Transition to Circular Trade?
          </h2>
          <p className="text-emerald-100/70 text-sm sm:text-base font-semibold leading-relaxed mb-8 max-w-2xl mx-auto">
            Create a secure corporate portal profile today as a buyer or supplier, and begin listing or sourcing materials in under two minutes.
          </p>
          {user?.accountType === "supplier" ? (
            <Link
              to="/add-listing"
              className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              <span>List Commercial Waste</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/raise-demand"
              className="w-full sm:w-auto inline-flex justify-center items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              <span>Raise a Demand</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* 8. Enterprise Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-white font-extrabold text-lg"
          >
            <Leaf className="h-5 w-5" style={{ color: "#4A7538" }} />
            <span>
              Reuse
              <span style={{ color: "#4A7538" }}>Hub</span>
            </span>
          </Link>

          {/* Description */}
          <p className="max-w-md text-sm leading-relaxed text-slate-500">
            A high-integrity digital ledger enabling seamless trading of circular
            B2B material resources locally.
          </p>

          {/* Copyright */}
          <div className="w-full pt-8 border-t border-slate-900">
            <p className="text-xs font-semibold text-slate-600">
              © {new Date().getFullYear()} ReuseHub Inc. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Home;