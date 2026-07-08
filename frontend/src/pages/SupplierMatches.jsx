import { useEffect, useState } from "react";
import { CheckCircle, XCircle, MapPin, Package, UserRound } from "lucide-react";
import api from "../services/api";

const SupplierMatches = () => {
  const [matches, setMatches] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : {};
    } catch (err) {
      console.error("Failed to parse user storage in SupplierMatches:", err);
      return {};
    }
  });

  const loadMatches = async () => {
    try {
      const res = await api.get("/matches/supplier");
      const matchesArray = res.data.matches || [];
      const formatted = matchesArray.map((match) => ({
        id: match.id || match._id,
        supplier: match.supplier?.businessName || "Supplier",
        supplierOwner: match.supplier?.ownerName || "Owner",
        supplierLocation: match.supplier?.location || "N/A",
        supplierPhone: match.supplier?.phone,
        supplierEmail: match.supplier?.email,

        buyer: match.buyer?.businessName || "Buyer",
        buyerOwner: match.buyer?.ownerName || "Owner",
        buyerLocation: match.buyer?.location || "N/A",
        buyerPhone: match.buyer?.phone,
        buyerEmail: match.buyer?.email,

        material: match.listing?.name || "Waste Material",
        category: match.listing?.category || "N/A",
        listingLocation: match.listing?.location || "N/A",
        listingPrice: match.listing?.price,
        listingDesc: match.listing?.description,
        listingDate: match.listing?.createdAt,

        demandMaterial: match.demand?.materialName || "Material Demand",
        demandLocation: match.demand?.location || "N/A",
        quantityAvailable: match.listing ? `${match.listing.quantity} ${match.listing.unit || ""}` : "N/A",
        quantityNeeded: match.demand ? `${match.demand.quantity} ${match.demand.unit || ""}` : "N/A",
        demandDate: match.demand?.createdAt,
        demandBudget: match.demand?.budget, // if available

        matchScore: match.matchScore,
        matchReason: match.matchReason,
        status: match.status,
        createdAt: match.createdAt,
      }));

      setMatches(formatted);
    } catch (err) {
      console.error("Error loading matches:", err);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/matches/${id}/status`, { status });
      setMatches((prev) =>
        prev.map((match) =>
          match.id === id
            ? {
                ...match,
                status,
              }
            : match
        )
      );
      loadMatches();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusClass = (status) => {
    if (status === "accepted_by_supplier") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "rejected") return "bg-rose-50 text-rose-700 border-rose-200";
    if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-bold text-[#4A7538] uppercase tracking-wider">
            Smart Matches
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Buyer Requests
          </h1>
          <p className="text-slate-600 mt-2">
            Accept or reject B2B circular trading and contact sharing requests.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
            No active matches found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Status & Match Score Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDF4EA] text-[#4A7538] border border-slate-100">
                        {match.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusClass(
                          match.status
                        )}`}
                      >
                        {match.status === "accepted_by_supplier" ? "Accepted ✓" : match.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-[#EDF4EA] text-[#4A7538] px-3 py-1 rounded-full border border-emerald-500/20">
                      <span className="text-xs font-extrabold">{match.matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {match.material} ↔ {match.demandMaterial}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      Match Created: {new Date(match.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Details Grid (Supplier & Buyer side-by-side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Supplier Section */}
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <h3 className="text-xs font-extrabold text-[#4A7538] uppercase tracking-wider mb-2 flex items-center space-x-1">
                        <UserRound className="h-3.5 w-3.5" />
                        <span>Supplier Details</span>
                      </h3>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p><strong>Business:</strong> {match.supplier}</p>
                        <p><strong>Owner:</strong> {match.supplierOwner || "N/A"}</p>
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{match.supplierLocation || "N/A"}</span>
                        </p>
                        <div className="mt-2.5 pt-2.5 border-t border-slate-200/50">
                          {match.status === "accepted_by_supplier" ? (
                            <div className="space-y-1 text-slate-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50">
                              <p><strong>📞 Phone:</strong> {match.supplierPhone || "N/A"}</p>
                              <p><strong>✉️ Email:</strong> {match.supplierEmail || "N/A"}</p>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                              <span>🔒 Contacts Hidden</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Buyer Section */}
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <h3 className="text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-2 flex items-center space-x-1">
                        <UserRound className="h-3.5 w-3.5" />
                        <span>Buyer Details</span>
                      </h3>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p><strong>Business:</strong> {match.buyer}</p>
                        <p><strong>Owner:</strong> {match.buyerOwner || "N/A"}</p>
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{match.buyerLocation || "N/A"}</span>
                        </p>
                        <div className="mt-2.5 pt-2.5 border-t border-slate-200/50">
                          {match.status === "accepted_by_supplier" ? (
                            <div className="space-y-1 text-slate-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50">
                              <p><strong>📞 Phone:</strong> {match.buyerPhone || "N/A"}</p>
                              <p><strong>✉️ Email:</strong> {match.buyerEmail || "N/A"}</p>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                              <span>🔒 Contacts Hidden</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Waste & Demand Parameters side-by-side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {/* Waste Listing Parameters */}
                    <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100">
                      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Waste Listing Details</h3>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p><strong>Material Name:</strong> {match.material}</p>
                        <p><strong>Available Qty:</strong> {match.quantityAvailable}</p>
                        <p><strong>Price per kg:</strong> {match.listingPrice ? `₹${match.listingPrice}` : "N/A"}</p>
                        <p>
                          <strong>Estimated Value:</strong>{" "}
                          {match.listingPrice && match.quantityAvailable
                            ? `₹${Math.round(
                                parseFloat(match.listingPrice.replace(/[^\d.]/g, "")) *
                                  parseFloat(match.quantityAvailable.replace(/[^\d.]/g, ""))
                              ).toLocaleString()}`
                            : "N/A"}
                        </p>
                        <p className="italic text-slate-500"><strong>Desc:</strong> "{match.listingDesc || "No description provided"}"</p>
                        <p className="text-[10px] text-slate-400">Listed: {match.listingDate ? new Date(match.listingDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>

                    {/* Seeker Demand Parameters */}
                    <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100">
                      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Buyer Demand Details</h3>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p><strong>Needed Quantity:</strong> {match.quantityNeeded}</p>
                        <p><strong>Target Location:</strong> {match.demandLocation || "N/A"}</p>
                        <p><strong>Buyer Budget:</strong> {match.demandBudget ? `₹${match.demandBudget}` : "N/A"}</p>
                        <p className="text-[10px] text-slate-400">Demand Created: {match.demandDate ? new Date(match.demandDate).toLocaleDateString() : "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation Reason */}
                  <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-4 mb-4">
                    <h4 className="text-[10px] font-extrabold text-[#4A7538] uppercase tracking-wider mb-1">🤖 AI Matching Insights</h4>
                    <p className="text-xs text-emerald-900/80 leading-relaxed italic">
                      "{match.matchReason && match.matchReason.length > 0 ? match.matchReason.join(", ") : "Matched based on circular compatibility metrics."}"
                    </p>
                  </div>
                </div>

                {/* Actions / Status Badges */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  {match.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(match.id, "accepted_by_supplier")}
                        className="flex-1 bg-[#4A7538] hover:bg-[#5b8c45] text-white py-3 rounded-xl flex justify-center items-center gap-2 font-bold cursor-pointer transition shadow-sm"
                      >
                        <CheckCircle size={18} />
                        Accept Request
                      </button>

                      <button
                        onClick={() => updateStatus(match.id, "rejected")}
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 py-3 rounded-xl flex justify-center items-center gap-2 font-bold cursor-pointer transition border border-rose-100"
                      >
                        <XCircle size={18} />
                        Reject Request
                      </button>
                    </div>
                  )}

                  {match.status === "accepted_by_supplier" && (
                    <div className="text-center py-2.5 px-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold text-sm">
                      Accepted ✓ Contact Details Unlocked!
                    </div>
                  )}

                  {match.status === "rejected" && (
                    <div className="text-center py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-sm">
                      Rejected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierMatches;