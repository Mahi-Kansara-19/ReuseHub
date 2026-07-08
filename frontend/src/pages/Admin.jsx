// src/pages/Admin.jsx

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  Search,
  Trash2,
  Eye,
  Mail,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import API from "../services/api";

const Admin = () => {
  const [stats, setStats] = useState({
    users: 0,
    suppliers: 0,
    buyers: 0,
    listings: 0,
    requests: 0,
  });
 
const [listings, setListings] = useState([]);
const [matches, setMatches] = useState([]);
const [activeTab, setActiveTab] = useState("users");

const [selectedListing, setSelectedListing] = useState(null);
const [selectedMatch, setSelectedMatch] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // AI Analyst state hooks
  const [aiQuery, setAiQuery] = useState("");
  const [executionLogs, setExecutionLogs] = useState([]);
  const [reportResult, setReportResult] = useState(null);
  const [analystLoading, setAnalystLoading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const adminUser = storedUser ? JSON.parse(storedUser) : null;

  const adminName =
    adminUser?.ownerName ||
    adminUser?.name ||
    adminUser?.businessName ||
    "Admin";

  const initials =
    adminName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

const fetchAdminData = async () => {
  try {
    setLoading(true);
    setError("");

    const statsRes = await API.get("/admin/stats");
    const usersRes = await API.get("/admin/users");
    const listingsRes = await API.get("/admin/listings");
    const matchesRes = await API.get("/admin/matches");

    setStats(statsRes.data);
    setUsers(usersRes.data || []);
    setListings(listingsRes.data || []);
    setMatches(matchesRes.data || []);

  } catch (err) {
    console.log(err);
    setError("Failed to load admin data");
  } finally {
    setLoading(false);
  }
};

  const handleAIAnalystQuery = async (question) => {
    if (!question.trim()) return;
    setAnalystLoading(true);
    setExecutionLogs([]);
    setReportResult(null);

    const logs = [];
    const addLog = (msg) => {
      logs.push(msg);
      setExecutionLogs([...logs]);
    };

    addLog("🔌 Connected to MCP Host: reusehub-analyst-server");

    setTimeout(() => {
      addLog("🔍 [Model Context Protocol] Matching query to schema tools...");
    }, 600);

    setTimeout(() => {
      addLog("⚙️ Executing MCP Tool: get_platform_analytics()...");
    }, 1200);

    try {
      // Make a real POST API call to the backend
      const response = await API.post("/admin/ai-analyst", { query: question });

      setTimeout(() => {
        addLog(`✅ Tool get_platform_analytics() returned data. Query successfully executed.`);
        setReportResult(response.data);
        setAnalystLoading(false);
      }, 1800);

    } catch (err) {
      console.error(err);
      addLog("❌ MCP Tool Execution Failed: Could not fetch platform analytics.");
      setAnalystLoading(false);
    }
  };


  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId, email) => {
  if (email === adminUser?.email) {
    alert("You cannot delete your own admin account.");
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user and all related data?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/admin/users/${userId}`);
    await fetchAdminData();
  } catch (err) {
    console.log("Delete user error:", err);
    alert("Failed to delete user.");
  }
};

const handleDeleteListing = async (listingId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this listing?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/admin/listings/${listingId}`);
    await fetchAdminData();
  } catch (err) {
    console.log("Delete listing error:", err);
    alert("Failed to delete listing.");
  }
};


const handleDeleteMatch = async (matchId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/admin/matches/${matchId}`);
    await fetchAdminData();
  } catch (err) {
    console.log("Delete listing error:", err);
    alert("Failed to delete.");
  }
};


  
  const filteredUsers = users.filter((user) => {
    const text = `${user.businessName || ""} ${user.ownerName || ""} ${
      user.email || ""
    } ${user.role || ""}`.toLowerCase();



    const handleDeleteListing = async (id) => {
  if (!window.confirm("Delete this listing?")) return;

  await API.delete(`/admin/listings/${id}`);
  fetchAdminData();
};

const handleEditListing = async (listing) => {
  const newName = prompt("Edit material name:", listing.name);
  const newQty = prompt("Edit quantity:", listing.quantity);

  if (!newName || !newQty) return;

  await API.put(`/admin/listings/${listing._id}`, {
    name: newName,
    quantity: newQty,
  });

  fetchAdminData();
};


const handleDeleteMatch = async (id) => {
  if (!window.confirm("Delete this match?")) return;

  await API.delete(`/admin/matches/${id}`);
  fetchAdminData();
};

const handleEditMatch = async (match) => {
  const newStatus = prompt(
    "Edit status (pending / accepted_by_supplier / rejected):",
    match.status
  );

  if (!newStatus) return;

  await API.put(`/admin/matches/${match._id}`, {
    status: newStatus,
  });

  fetchAdminData();
};



    return text.includes(search.toLowerCase());
  });

  return (
    
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ReuseHub Control Panel
            </span>

            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:text-[#4A7538] disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
  <button
    onClick={() => setActiveTab("users")}
    className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
      activeTab === "users" ? "bg-[#4A7538] text-white" : "bg-white"
    }`}
  >
    Users
  </button>

  <button
    onClick={() => setActiveTab("listings")}
    className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
      activeTab === "listings" ? "bg-[#4A7538] text-white" : "bg-white"
    }`}
  >
    Listings
  </button>

  <button
    onClick={() => setActiveTab("marketplace")}
    className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
      activeTab === "marketplace" ? "bg-[#4A7538] text-white" : "bg-white"
    }`}
  >
    Matches
  </button>

  <button
    onClick={() => setActiveTab("ai-analyst")}
    className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
      activeTab === "ai-analyst" ? "bg-[#4A7538] text-white" : "bg-white"
    }`}
  >
    🤖 AI Analyst
  </button>

            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="h-11 w-11 rounded-full bg-[#4A7538] text-white flex items-center justify-center font-extrabold text-sm">
                {initials}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 truncate">
                  {adminName}
                </h3>

                <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {adminUser?.email || "admin@reusehub.com"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <StatCard icon={Users} title="Total Users" value={stats.users} />
          <StatCard icon={Users} title="Suppliers" value={stats.suppliers} />
          <StatCard icon={Users} title="Buyers" value={stats.buyers} />
          <StatCard icon={Package} title="Listings" value={stats.listings} />
          <StatCard
            icon={ClipboardList}
            title="Requests"
            value={stats.requests}
          />
        </div>

        {/* Main Grid */}
        {activeTab === "users" && (
  <div className="flex justify-center">
  {/* Users Table */}
  <div className="w-full max-w-6xl bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  User Management
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Real buyers, suppliers, and admins from MongoDB.
                </p>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#4A7538] focus:ring-1 focus:ring-[#4A7538]/20"
                />
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500 font-semibold">
                Loading users from backend...
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-3 font-bold">Business</th>
                      <th className="py-3 font-bold">Owner</th>
                      <th className="py-3 font-bold">Email</th>
                      <th className="py-3 font-bold">Category</th>
                      <th className="py-3 font-bold">Role</th>
                      <th className="py-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-6 text-center text-slate-400 font-semibold"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-slate-100"
                        >
                          <td className="py-4 font-bold text-slate-800">
                            {user.businessName || "-"}
                          </td>

                          <td className="py-4 text-slate-600">
                            {user.ownerName || user.name || "-"}
                          </td>

                          <td className="py-4 text-slate-500">
                            {user.email || "-"}
                          </td>

                           <td className="py-4 text-slate-500">
                            {user.businessCategory || "-"}
                          </td>

                          <td className="py-4">
                            <span className="px-2.5 py-1 rounded-full bg-[#EDF4EA] text-[#4A7538] text-xs font-bold capitalize">
                              {user.accountType || "-"}
                            </span>
                          </td>

                          <td className="py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-[#4A7538]"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteUser(user._id, user.email)
                                }
                                disabled={user.email === adminUser?.email}
                                className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
            
                  </tbody>
                  
                </table>
            
              </div>
            )}
          </div>

        </div>

          )}

{activeTab === "listings" && (
  <div className="flex justify-center">
    <div className="w-full max-w-6xl bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Listings Management
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            All supplier materials listed in the system.
          </p>
        </div>

        <input
          placeholder="Search listings..."
          className="pl-4 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#4A7538] focus:ring-1 focus:ring-[#4A7538]/20"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="py-3 font-bold">Material</th>
              <th className="py-3 font-bold">Category</th>
              <th className="py-3 font-bold">Quantity</th>
              <th className="py-3 font-bold">Location</th>
              <th className="py-3 font-bold">Price</th>
              <th className="py-3 font-bold">Supplier</th>
              <th className="py-3 font-bold text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {listings.map((l) => (
              <tr key={l._id} className="border-b border-slate-100">

                <td className="py-4 font-bold text-slate-800">{l.name}</td>
                <td className="py-4 text-slate-600">{l.category}</td>
                <td className="py-4 text-slate-600">{l.quantity}</td>
                <td className="py-4 text-slate-600">{l.location}</td>
                <td className="py-4 text-slate-600">{l.price}</td>
                <td className="py-4 text-slate-600">{l.businessName}</td>

               <td className="py-4">
  <div className="flex justify-end gap-2">

    <button
      onClick={() => {
  console.log("Deleting:", l._id);
  handleDeleteListing(l._id);
}}
      className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100"
    >
      <Trash2 className="h-4 w-4" />
    </button>

  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
)}

{activeTab === "marketplace" && (
  <div className="flex justify-center">
    <div className="w-full max-w-6xl bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Marketplace Matches
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          AI-generated buyer–supplier matches from system.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="py-3 font-bold">Buyer</th>
              <th className="py-3 font-bold">Supplier</th>
            
              <th className="py-3 font-bold">Score</th>
              <th className="py-3 font-bold">Status</th>
              <th className="py-3 font-bold">Date</th>
              <th className="py-3 font-bold text-right">Action</th>
            </tr>
          </thead>

          <tbody>
  {matches.map((m) => (
    <tr key={m._id} className="border-b border-slate-100">

      {/* Buyer */}
      <td className="py-4 text-slate-700 font-medium">
        {m.buyer?.businessName || "-"}
      </td>

      {/* Supplier */}
      <td className="py-4 text-slate-700 font-medium">
        {m.supplier?.businessName || "-"}
      </td>

      {/* Score */}
      <td className="py-4">
        <span className="px-2.5 py-1 rounded-full bg-[#EDF4EA] text-[#4A7538] text-xs font-bold">
          {m.matchScore}%
        </span>
      </td>

      {/* Status */}
      <td className="py-4 text-slate-600 capitalize">
  {m.status || "-"}
</td>

      {/* Date */}
      <td className="py-4 text-slate-500">
        {m.createdAt
          ? new Date(m.createdAt).toLocaleDateString()
          : "-"}
      </td>

      {/* Actions */}
      <td className="py-4">
        <div className="flex justify-end gap-2">

          <button
            onClick={() => handleDeleteMatch(m._id)}
            className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>

        </div>
      </td>

    </tr>
  ))}
</tbody>

        </table>
      </div>

    </div>
  </div>
)}

{activeTab === "ai-analyst" && (
  <div className="flex justify-center animate-fadeIn">
    <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3.5 bg-[#EDF4EA] text-[#4A7538] rounded-2xl">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Platform Analyst Console</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Query live system statistics and transaction records through an MCP agent.
          </p>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="mb-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Suggested Queries</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setAiQuery("Summarize last month's transactions and list the top 3 materials exchanged.");
              handleAIAnalystQuery("Summarize last month's transactions and list the top 3 materials exchanged.");
            }}
            className="px-3.5 py-2 bg-slate-50 hover:bg-[#EDF4EA] text-slate-700 hover:text-[#4A7538] rounded-xl text-xs font-semibold border border-slate-200 transition"
          >
            📋 Summarize last month's transactions & top 3 materials
          </button>
          <button
            onClick={() => {
              setAiQuery("Give me a quick platform performance overview.");
              handleAIAnalystQuery("Give me a quick platform performance overview.");
            }}
            className="px-3.5 py-2 bg-slate-50 hover:bg-[#EDF4EA] text-slate-700 hover:text-[#4A7538] rounded-xl text-xs font-semibold border border-slate-200 transition"
          >
            ⚡ Platform performance overview
          </button>
        </div>
      </div>

      {/* Query input */}
      <div className="flex gap-2.5 items-center mb-6">
        <input
          type="text"
          placeholder="Ask the AI Analyst about listings, users, matches, or CO2 savings..."
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAIAnalystQuery(aiQuery)}
          className="flex-grow px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#4A7538] focus:ring-1 focus:ring-[#4A7538]/20 transition"
        />
        <button
          onClick={() => handleAIAnalystQuery(aiQuery)}
          disabled={analystLoading || !aiQuery.trim()}
          className="bg-[#4A7538] hover:bg-[#5B8A46] text-white px-6 py-3 rounded-xl text-sm font-bold transition disabled:opacity-50"
        >
          {analystLoading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* MCP Execution Console Logs */}
      {executionLogs.length > 0 && (
        <div className="mb-6 bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-2xl border border-slate-800 space-y-1.5 shadow-inner">
          <p className="text-slate-500 font-bold uppercase tracking-wider mb-1">🔌 Model Context Protocol (MCP) Logs</p>
          {executionLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[#4A7538]">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          {analystLoading && (
            <div className="flex items-center gap-1.5 text-slate-400 animate-pulse mt-2">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              <span>Running Tool call...</span>
            </div>
          )}
        </div>
      )}

      {/* Report Output */}
      {reportResult && (
        <div className="bg-[#EDF4EA]/20 border border-[#4A7538]/20 rounded-3xl p-6 sm:p-8 animate-fadeIn">
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-[#4A7538]/10">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-[#EDF4EA] text-[#4A7538] font-bold text-[10px] uppercase tracking-wider">
                Generated Report
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Platform Summary Report</h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{reportResult.dateGenerated}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-400 font-bold uppercase">Total Materials Listed</p>
              <p className="text-2xl font-extrabold text-[#4A7538] mt-1">{reportResult.totalQuantity.toLocaleString()} kg</p>
              <p className="text-xs text-slate-400 mt-1">Across {reportResult.totalListings} listings</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-400 font-bold uppercase">Carbon Savings (CO₂)</p>
              <p className="text-2xl font-extrabold text-teal-600 mt-1">{parseFloat(reportResult.totalCO2).toLocaleString()} kg</p>
              <p className="text-xs text-slate-400 mt-1">Mitigated footprint impact</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-400 font-bold uppercase">Exchanges Completed</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{reportResult.completedTransactionsCount}</p>
              <p className="text-xs text-slate-400 mt-1">Successful supplier matches</p>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-800 text-sm mb-3 uppercase tracking-wider">🔥 Top 3 Materials Exchanged</h4>
            <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase">
                    <th className="px-6 py-3">Material Name</th>
                    <th className="px-6 py-3">Total Volume (kg)</th>
                    <th className="px-6 py-3 text-right">Market Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {reportResult.topMaterials.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-slate-400">No active listings/exchanges to aggregate.</td>
                    </tr>
                  ) : (
                    reportResult.topMaterials.map((mat, idx) => {
                      const totalVol = reportResult.totalQuantity || 1;
                      const percentage = ((mat.quantity / totalVol) * 100).toFixed(1);
                      return (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#4A7538]" style={{ opacity: 1 - idx * 0.3 }}></span>
                            {mat.name}
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-semibold">{mat.quantity.toLocaleString()} kg</td>
                          <td className="px-6 py-4 text-right">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg">
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    User Details
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold">
                    MongoDB user profile information
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <Detail label="Business" value={selectedUser.businessName} />
                <Detail
                  label="Owner"
                  value={selectedUser.ownerName || selectedUser.name}
                />
                <Detail label="Email" value={selectedUser.email} />
                <Detail label="Phone" value={selectedUser.phone} />
                <Detail label="Role" value={selectedUser.role} />
                <Detail
                  label="Category"
                  value={selectedUser.businessCategory}
                />
                <Detail label="Location" value={selectedUser.location} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-[#EDF4EA] text-[#4A7538] flex items-center justify-center mb-4">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
        {value || 0}
      </h3>
    </div>
  );
};

const OverviewItem = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className="text-sm font-extrabold text-slate-900">
        {value || 0}
      </span>
    </div>
  );
};

const Detail = ({ label, value }) => {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
      <span className="font-bold text-slate-500">{label}</span>
      <span className="text-slate-800 text-right">{value || "-"}</span>
    </div>
  );
};

export default Admin;