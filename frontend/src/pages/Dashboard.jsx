import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Plus, 
  Search, 
  Settings, 
  BarChart3, 
  Trash2, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle,
  Inbox,
  Edit3,
  Brain,
  Sparkles,
  X,
  RefreshCw
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  Tooltip 
} from "recharts";
import { mockDataService } from "../services/mockData";
import { deleteWasteListing, getMyWasteListings } from "../services/wasteService";
import { getMyDemands } from "../services/demandService";
import API from "../services/api";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  let user = { businessName: "Apex Packagers Ltd", accountType: "supplier" };
  try {
    const u = localStorage.getItem("user");
    if (u && u !== "undefined") {
      user = JSON.parse(u) || user;
    }
  } catch (e) {
    console.warn("Failed to parse user storage in Dashboard:", e);
  }
  
  const [stats, setStats] = useState({});
  const [myListings, setMyListings] = useState([]);
  const [allDemands, setAllDemands] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  // AI Insights State
  const [selectedListingForAI, setSelectedListingForAI] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState("");
  const [sharingContactId, setSharingContactId] = useState(null);
  const [shareSuccess, setShareSuccess] = useState("");
  const [supplierMatches, setSupplierMatches] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoadingListings(true);

      const [listingsRes, demandsRes, analyticsRes] = await Promise.all([
        API.get("/listings"),
        API.get("/demands"),
        API.get("/analytics"),
      ]);

      const listings = listingsRes.data || [];
      const demands = demandsRes.data || [];
      const userAnalytics = analyticsRes.data || {};

      setAnalytics(userAnalytics);

      if (user.accountType === "supplier") {
        try {
          const ownListings = await getMyWasteListings();
          setMyListings(ownListings);
        } catch (e) {
          console.error("Failed to load dashboard own listings:", e);
          // Fallback
          const ownListings = listings.filter(l => l.owner === user._id || l.owner?._id === user._id || l.userId === user._id);
          setMyListings(ownListings);
        }

        try {
          const matchesRes = await API.get("/matches/supplier");
          setSupplierMatches(matchesRes.data.matches || []);
        } catch (err) {
          console.error("Error loading matches on dashboard:", err);
        }

        setStats({
          activeListings: listings.filter(l => l.availability === "available").length,
          totalDemands: demands.length,
        });

      } else {
        setMyListings([]);
        try {
          const ownDemands = await getMyDemands();
          setAllDemands(ownDemands);
        } catch (e) {
          console.error("Failed to load dashboard own demands:", e);
          const ownDemands = demands.filter(d => d.buyer === user._id || d.buyer?._id === user._id);
          setAllDemands(ownDemands);
        }

        setStats({
          activeListings: listings.filter(l => l.availability === "available").length,
          totalDemands: demands.length,
        });
      }

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteListing = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this material listing?")) {
      await deleteWasteListing(id);
      fetchDashboardData();
      if (selectedListingForAI && selectedListingForAI._id === id) {
        setSelectedListingForAI(null);
      }
    }
  };

  const handleShowAIInsights = async (listing) => {
    setSelectedListingForAI(listing);
    setAiInsights(null);
    setLoadingAI(true);
    setErrorAI("");
    
    try {
      const res = await API.get(`/ai/recommendation/${listing._id}`);
      setAiInsights(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        // Try to generate it on-the-fly!
        try {
          const res = await API.post(`/ai/analyze/${listing._id}`, {});
          setAiInsights(res.data);
        } catch (err2) {
          setErrorAI(err2.response?.data?.message || "Failed to generate AI insights.");
        }
      } else {
        setErrorAI(err.response?.data?.message || "Failed to fetch AI insights.");
      }
    } finally {
      setLoadingAI(false);
    }
  };

  const handleReanalyzeListing = async (listing) => {
    setLoadingAI(true);
    setErrorAI("");
    try {
      const res = await API.post(`/ai/analyze/${listing._id}`, {});
      setAiInsights(res.data);
    } catch (err) {
      setErrorAI(err.response?.data?.message || "Failed to refresh AI insights.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleShareContact = async (buyerId) => {
    if (!selectedListingForAI) return;
    setSharingContactId(buyerId);
    setShareSuccess("");
    try {
      await API.post("/ai/share-contact", {
        listingId: selectedListingForAI._id,
        buyerId: buyerId,
      });
      
      setShareSuccess("Contact details shared successfully!");
      
      // Refresh matches
      const matchesRes = await API.get("/matches/supplier");
      setSupplierMatches(matchesRes.data.matches || []);
      
      setTimeout(() => setShareSuccess(""), 4000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to share contact details.");
    } finally {
      setSharingContactId(null);
    }
  };

  const isContactShared = (buyerId) => {
    return supplierMatches.some(m => 
      m.listing?._id === selectedListingForAI?._id && 
      (m.buyer?._id === buyerId || m.buyer === buyerId) && 
      m.status === "accepted_by_supplier"
    );
  };

  // Calculate user-specific metrics
  const ownCO2 = analytics 
    ? (analytics.totalCO2Saved || 0).toFixed(2)
    : (user.accountType === "supplier"
        ? myListings.reduce((sum, l) => sum + (parseFloat(l.quantity) || 0) * 0.44, 0).toFixed(2)
        : "0.00"
      );
  const ownExchanges = user.accountType === "supplier" ? myListings.length : allDemands.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-950 p-8 rounded-3xl text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        
        <div className="z-10">
          
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user.businessName} 
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Console node active. Registered as a <span className="text-emerald-400 font-bold uppercase">{user.accountType}</span>.
          </p>
        </div>

        
        {/* Dashboard Quick CTA */}
        {user.accountType === "supplier" ? (
           <NavLink
  to="/certificate"
  className="z-10 inline-flex items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow transition-all hover:-translate-y-0.5 text-sm"
>
  🏆 Certificate
</NavLink>

        ) : (
          <Link 
            to="/listings" 
            className="z-10 inline-flex items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow transition-all hover:-translate-y-0.5 text-sm"
          >
            <Search className="h-4.5 w-4.5" />
            <span>Source Materials</span>
          </Link>
        )}
      </div>

      {/* Grid 1: Core Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {user.accountType === "supplier" ? "My Active Listings" : "Platform Active Listings"}
            </span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1">
              {user.accountType === "supplier" ? myListings.length : stats.activeListings}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            Updated just now
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {user.accountType === "supplier" ? "My Circular Exchanges" : "Demands Posted"}
            </span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1">
              {user.accountType === "supplier" ? ownExchanges : allDemands.length}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            Direct matching active
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Carbon Offsets
            </span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1 text-primary">
              {ownCO2} kg CO₂
            </span>
          </div>
         {/*} <p className="text-[10px] text-emerald-600 font-bold mt-3 flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Estimated ledger tally</span>
          </p>*/}
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Platform Status
            </span>
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-lg font-extrabold text-slate-800">
                Verified Hub
              </span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Grid 2: Core Double-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Columns - Tables & Interactive Lists */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* User Listings Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {user.accountType === "supplier" ? "Manage My Material Listings" : "My Demands"}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {user.accountType === "supplier" ? "Modify or delete listed materials in real-time." : "Manage demands raised by you."}
                </p>
              </div>
            </div>

            {/* List */}
            {user.accountType === "supplier" ? (
              loadingListings ? (
                <div className="text-center py-10 flex flex-col justify-center items-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                  <h4 className="font-bold text-slate-800 text-xs">Loading material listings...</h4>
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center py-10">
                  <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-xs">No active listings posted</h4>
                  <Link to="/add-listing" className="text-xs font-bold text-primary hover:underline mt-1 inline-block">
                    Post your first waste listing now
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {myListings.map((item) => (
                    <div key={item._id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase mt-0.5">{item.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-xs text-slate-950 font-bold block">{item.quantity}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{item.price}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => handleShowAIInsights(item)}
                            title="AI Insights"
                            className={`p-2 rounded-xl border border-transparent transition-all cursor-pointer ${
                              selectedListingForAI?._id === item._id 
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse" 
                                : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-100"
                            }`}
                          >
                            <Brain className="h-4 w-4" />
                          </button>

                          <button 
                            onClick={() => navigate(`/edit-listing/${item._id}`)}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteListing(item._id)}
                            className="p-2 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              allDemands.length === 0 ? (
                <div className="text-center py-10">
                  <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-xs">No active demands raised</h4>
                  <Link to="/raise-demand" className="text-xs font-bold text-primary hover:underline mt-1 inline-block">
                    Raise your first demand now
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {allDemands.map((demand) => (
                    <div key={demand._id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{demand.materialName}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase mt-0.5">{demand.category}</span>
                      </div>

                      <div className="flex items-center space-x-6 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-xs text-slate-950 font-bold block">{demand.quantity} {demand.unit}</span>
                          <span className={`inline-block mt-0.5 text-[8px] font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase ${demand.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                            {demand.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

         
        
          </div>
      

        {/* Right 4 Columns - Quick Actions & Mini Charts */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Insights Card */}
          {selectedListingForAI && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Brain className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">🤖 AI Insights</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {selectedListingForAI.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleReanalyzeListing(selectedListingForAI)}
                    title="Refresh AI Insights"
                    disabled={loadingAI}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingAI ? "animate-spin" : ""}`} />
                  </button>
                  <button 
                    onClick={() => setSelectedListingForAI(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              {loadingAI ? (
                <div className="text-center py-10 flex flex-col justify-center items-center">
                  <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <h4 className="font-bold text-slate-800 text-xs">AI Agent analyzing listing...</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Validating, pricing, and matching buyers</p>
                </div>
              ) : errorAI ? (
                <div className="text-center py-6 bg-rose-50 border border-rose-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-rose-600">{errorAI}</p>
                  <button
                    onClick={() => handleShowAIInsights(selectedListingForAI)}
                    className="mt-3 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : aiInsights ? (
                <div className="space-y-6">
                  
                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 rounded-xl p-2.5">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Quality</span>
                      <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                        {aiInsights.qualityScore} <span className="text-[10px] font-normal text-slate-400">/100</span>
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Price</span>
                      <span className="text-sm font-extrabold text-emerald-600 mt-1 block">
                        ₹{aiInsights.suggestedPrice}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Revenue</span>
                      <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                        ₹{aiInsights.expectedRevenue?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Top Recommended Buyers */}
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">Top Recommended Buyers</h4>
                    
                    {aiInsights.recommendedBuyers && aiInsights.recommendedBuyers.length > 0 ? (
                      <div className="space-y-2.5">
                        {aiInsights.recommendedBuyers.slice(0, 3).map((rec, index) => {
                          const buyerObj = rec.buyerId;
                          const buyerId = buyerObj?._id || buyerObj;
                          const bName = buyerObj?.businessName || rec.businessName || "Acme Buyer";
                          const isShared = isContactShared(buyerId);
                          
                          return (
                            <div key={index} className="flex justify-between items-center bg-slate-50 rounded-2xl p-3 border border-slate-100">
                              <div className="min-w-0 pr-2">
                                <div className="flex items-center space-x-1.5">
                                  <span className="text-xs font-extrabold text-slate-800 truncate">{bName}</span>
                                </div>
                                <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">
                                  Compatibility: {rec.compatibility}%
                                </span>
                              </div>
                              
                              <button
                                disabled={isShared || sharingContactId === buyerId}
                                onClick={() => handleShareContact(buyerId)}
                                className={`text-[9px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer transition-all flex-shrink-0 ${
                                  isShared 
                                    ? "bg-slate-100 text-slate-400 border border-slate-200" 
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                }`}
                              >
                                {sharingContactId === buyerId ? "Sharing..." : isShared ? "Shared ✓" : "Share Contact"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">No buyer recommendations matching this waste type.</p>
                    )}
                  </div>

                  {/* Sustainability Impact */}
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">Sustainability Impact</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
                        <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider block">CO₂ Saved</span>
                        <span className="text-base font-extrabold text-emerald-700 mt-1 block">
                          {aiInsights.carbonSaved} Tons
                        </span>
                      </div>
                      <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
                        <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider block">Landfill Reduced</span>
                        <span className="text-base font-extrabold text-emerald-700 mt-1 block">
                          {aiInsights.landfillReduced ? `${aiInsights.landfillReduced} kg` : "0 kg"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-semibold text-slate-500 bg-slate-50 p-2 rounded-xl">
                      <span>AI Model Confidence:</span>
                      <span className="font-extrabold text-slate-800">{aiInsights.confidence}%</span>
                    </div>
                  </div>

                  {/* Recommendation Text */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Recommendation Reasoning</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      "{aiInsights.reasoning || "Analyzing match potential..."}"
                    </p>
                  </div>

                  {shareSuccess && (
                    <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-xl p-2.5 text-center">
                      {shareSuccess}
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400">Click the brain icon on any listing to load insights.</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm pb-4 border-b border-slate-100 mb-4">Quick Console Actions</h3>
            <div className="space-y-2">
              <Link 
                to="/listings" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100 hover:border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Search className="h-4.5 w-4.5" />
                  </div>
                  <span>Browse Marketplace</span>
                </div>
                <ArrowRight className="h-4.5 w-4.5 text-slate-400" />
              </Link>
              
              <Link 
                to="/analytics" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100 hover:border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <span>Compliance Analytics</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link 
                to="/profile" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100 hover:border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-accent/10 text-accent">
                    <Settings className="h-4 w-4" />
                  </div>
                  <span>Edit Profile settings</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </div>

          
        
        </div>

      </div>

    </div>
  );
};

export default Dashboard;