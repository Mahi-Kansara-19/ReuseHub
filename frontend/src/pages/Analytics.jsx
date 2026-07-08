import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  Sparkles, 
  TrendingUp, 
  Leaf, 
  Handshake, 
  ShieldCheck, 
  Download,
  Calendar,
  Layers
} from "lucide-react";
import axios from "axios";
import API from "../services/api";

const Analytics = () => {
  const [stats, setStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [viewScope, setViewScope] = useState("platform");

  useEffect(() => {
    if (stats.totalCO2Saved > 0) {
      setViewScope("personal");
    }
  }, [stats]);

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get("/analytics");

      setStats(data);
      setMonthlyData(data.monthlyData || []);
      setCategoryData(data.categoryData || []);

    } catch (err) {
      console.error("Analytics Error:", err.response?.data || err.message);
    }
  };

  fetchAnalytics();
}, []);

  const activeCO2 = viewScope === "personal" ? (stats.totalCO2Saved || 0) : (stats.globalCO2Saved || 0);

  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Title with CTA */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Sustainability Analytics
          </h1>
          <strong>{stats.title || "Sustainability Analytics"}</strong>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Real-time calculation of material circularity, carbon offsets, and trading ratios.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Scope Toggles */}
          <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex gap-1">
            <button
              onClick={() => setViewScope("platform")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                viewScope === "platform"
                  ? "bg-[#4A7538] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌍 Platform Impact
            </button>
            <button
              onClick={() => setViewScope("personal")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                viewScope === "personal"
                  ? "bg-[#4A7538] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              💼 My Business Impact
            </button>
          </div>

          <button 
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold px-4 py-3 rounded-xl text-xs shadow-sm hover:shadow transition-all"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export ESG Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {viewScope === "personal" ? "My Real CO₂ Saved" : "Platform Total CO₂ Saved"}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {viewScope === "personal" ? (stats.totalCO2Saved || 0) : (stats.globalCO2Saved || 0)} kg
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {viewScope === "personal" ? "My Real Waste Reused" : "Platform Total Waste Reused"}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {viewScope === "personal" ? (stats.totalReusedQuantity || 0) : (stats.globalReusedQuantity || 0)} kg
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Handshake className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {stats.cards?.card3Label || "Active Records"}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {stats.cards?.card3Value || 0} {stats.cards?.card3Unit}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            100% successful coordination rate
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {stats.cards?.card4Label || "My Records"}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {stats.cards?.card4Value || 0} {stats.cards?.card4Unit}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            Circular compliance validated
          </p>
        </div>
      </div>

      {/* Carbon Impact Equivalents Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">ESG Impact & Environmental Equivalency</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Trees */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl">
              🌲
            </div>
            <div>
              <span className="text-xs font-bold text-[#4A7538] uppercase tracking-wider block">Trees Planted Equivalent</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {activeCO2 ? Math.max(1, Math.round(activeCO2 / 22)) : 0} Trees
              </span>
              <p className="text-xs text-emerald-700/80 mt-0.5">Annual absorption offset by mature trees.</p>
            </div>
          </div>

          {/* Card 2: Cars */}
          <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-200 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-sky-505 bg-sky-500 text-white flex items-center justify-center text-2xl">
              🚗
            </div>
            <div>
              <span className="text-xs font-bold text-sky-850 text-sky-700 uppercase tracking-wider block">Passenger Cars Off Road</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {activeCO2 ? (activeCO2 / 4600).toFixed(3) : "0.000"} Cars
              </span>
              <p className="text-xs text-sky-700/80 mt-0.5">Average yearly emissions removed.</p>
            </div>
          </div>

          {/* Card 3: Homes */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl">
              🏠
            </div>
            <div>
              <span className="text-xs font-bold text-amber-850 text-amber-700 uppercase tracking-wider block">Household Electricity Saved</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {activeCO2 ? (activeCO2 / 7500).toFixed(3) : "0.000"} Homes
              </span>
              <p className="text-xs text-amber-700/80 mt-0.5">Average home electricity offset.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* Area Chart - Weight Reused Trend */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Circularity Volumetric Trend</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Month-over-month tonnage accumulated in secondary reuse.</p>
            </div>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500">
              <Calendar className="h-3 w-3" />
              <span>Last 6 Months</span>
            </span>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A7538" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4A7538" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} unit="kg" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", color: "#FFF" }}
                  labelStyle={{ fontWeight: "extrabold", fontSize: "11px", marginBottom: "4px" }}
                  itemStyle={{ color: "#34D399", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="weight" stroke="#4A7538" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" name="Material Saved (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie/Donut Chart - Sector Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Material Breakdown</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Volumetric composition by trading sector.</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", color: "#FFF", fontSize: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text Badge */}
            <div className="absolute text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Sector</span>
              <span className="block text-sm font-extrabold text-slate-800 mt-0.5">Packaging</span>
            </div>
          </div>

          {/* Custom Labels List */}
          <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart - Monthly CO2 Savings Ledgers */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Carbon Offset Equivalency</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Monthly offset calculations matching organic decay and combustion parameters.</p>
          </div>
        </div>

        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} unit="kg" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", color: "#FFF" }}
                labelStyle={{ fontWeight: "extrabold", fontSize: "11px", marginBottom: "4px" }}
                itemStyle={{ color: "#22D3EE", fontSize: "11px" }}
              />
              <Bar dataKey="co2" fill="#14B8A6" radius={[4, 4, 0, 0]} name="CO₂ Offset (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
