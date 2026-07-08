import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Layers,
  Weight,
  Heart,
  MessageSquare,
  X,
  CheckCircle,
  SlidersHorizontal,
} from "lucide-react";

import { getAllWasteListings } from "../services/wasteService";
import api from "../services/api";
const Marketplace = () => {
  const navigate = useNavigate();

  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch (e) {
    console.warn("localStorage is blocked:", e);
  }

  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [contactModal, setContactModal] = useState({ open: false, listing: null });
  const [messageText, setMessageText] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);
const user = JSON.parse(localStorage.getItem("user"));
const businessName = user?.businessName || "Buyer";
  const categories = [
    "All",
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
    const loadListings = async () => {
      try {
        setLoading(true);
        const data = await getAllWasteListings();

        const realListings = Array.isArray(data)
          ? data
          : data.listings || data.wasteListings || [];

        setListings(realListings);
      } catch (e) {
        console.error("Failed to load real listings:", e);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const getListingId = (item) => item._id || item._id;

  const getImageUrl = (item) => {
    if (item.image) return item.image;
    if (item.imageUrl) return item.imageUrl;
    if (item.photo) return item.photo;
    if (item.images?.length > 0) return item.images[0];

    return "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80";
  };

  const getPriceText = (item) => {
    if (!item.price || item.price === "0") return "Free";
    if (String(item.price).toLowerCase() === "free") return "Free";
   return `₹${item.price}`;
  };

  const handleFavorite = (id, e) => {
    e.stopPropagation();

    if (!token) {
      navigate("/get-started");
      return;
    }

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };
const handleContact = async (listing, e) => {
  e.stopPropagation();

  try {
    await api.post("/matches/request", {
      listingId: listing._id,
    });

    setAlert({
      show: true,
      type: "success",
      message: "Request sent successfully.",
    });

    setTimeout(() => {
      setAlert({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
 } catch (err) {
  console.log(err.response?.data);
  console.log(err.response?.status);
  console.log(err);

  setAlert({
    show: true,
    type: "error",
    message: err.response?.data?.message || "Failed to send request",
  });
}

    const listingName = listing.materialName || listing.name || "this material";
    const supplierName =
      listing.ownerName || listing.businessName || listing.user?.businessName || "Supplier";

    setContactModal({ open: true, listing });
    setMessageText(
      `Hi ${supplierName}, we at ${user?.businessName} are interested in your listing "${listingName}". Please let us know if it is still available.`
    );
  };

  const submitMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    setContactModal({ open: false, listing: null });
    setMessageText("");

    setAlert({
      show: true,
      message: "Request sent to supplier! Wait for them to accept the request to get access on their contact details!",
      type: "success",
    });

    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const filteredListings = listings
    .filter((item) => {
      const name = item.materialName || item.name || "";
      const businessName =
        item.businessName || item.ownerName || item.user?.businessName || "";
      const description = item.description || "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        businessName.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const priceText = getPriceText(item).toLowerCase();
      const isFree = priceText === "free";

      const matchesPrice =
        selectedPrice === "All" ||
        (selectedPrice === "Free" && isFree) ||
        (selectedPrice === "Paid" && !isFree);

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      const qtyA = parseFloat(a.quantity) || 0;
      const qtyB = parseFloat(b.quantity) || 0;

      if (sortBy === "quantity-desc") return qtyB - qtyA;
      if (sortBy === "quantity-asc") return qtyA - qtyB;

      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl flex items-center space-x-2.5 shadow-sm"
          >
            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Materials Index Marketplace
          </h1>
        
        </div>

        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search description, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full rounded-2xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <span>Refinement Console</span>
            </h3>

            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedPrice("All");
                setSortBy("newest");
                setSearch("");
              }}
              className="text-[10px] font-extrabold text-primary hover:underline uppercase tracking-wider"
            >
              Reset
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Sectors & Categories
            </label>

            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Pricing Model
            </label>

            <div className="grid grid-cols-3 gap-2">
              {["All", "Free", "Paid"].map((priceOpt) => (
                <button
                  key={priceOpt}
                  onClick={() => setSelectedPrice(priceOpt)}
                  className={`py-1.5 px-2 rounded-lg text-center text-[10px] font-bold border transition-all ${
                    selectedPrice === priceOpt
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {priceOpt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Order By
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold cursor-pointer outline-none focus:border-primary"
            >
              <option value="newest">Recently Listed</option>
              <option value="quantity-desc">Quantity High to Low</option>
              <option value="quantity-asc">Quantity Low to High</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-9">
          {loading ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-sm flex flex-col justify-center items-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-sm font-bold text-slate-800">
                Fetching real marketplace data...
              </h3>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-sm">
              <Layers className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">
                No Real Listings Found
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Add listings from supplier account to see them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {filteredListings.map((item) => {
                const id = getListingId(item);
                const isFavorite = favorites.includes(id);
                const name = item.materialName || item.name || "Unnamed Material";
                const businessName =
                  item.businessName ||
                  item.ownerName ||
                  item.user?.businessName ||
                  "Unknown Business";

                return (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="h-44 overflow-hidden relative bg-slate-100">
                      <img
                        src={getImageUrl(item)}
                        alt={name}
                        className="w-full h-full object-cover"
                      />

                      <span className="absolute top-4 left-4 inline-block text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-slate-950/70 text-white backdrop-blur-sm uppercase">
                        {item.category || "Uncategorized"}
                      </span>

                      <button
                        onClick={(e) => handleFavorite(id, e)}
                        className={`absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all ${
                          isFavorite
                            ? "bg-rose-50 border-rose-200/30 text-rose-500"
                            : "bg-white/80 border-white/40 text-slate-500 hover:text-rose-500 hover:bg-white"
                        }`}
                      >
                        <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="font-extrabold text-slate-950 text-base leading-tight">
                            {name}
                          </h3>

                          <span
                            className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                              getPriceText(item).toLowerCase() === "free"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-blue-50 text-blue-600 border border-blue-200"
                            }`}
                          >
                            {getPriceText(item)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-3 font-medium mb-4 leading-relaxed">
                          {item.description || "No description provided."}
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-slate-100 pt-4 mb-4">
                        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                          <Weight className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            Volume:{" "}
                            <strong className="text-slate-900">
                              {item.quantity} {item.unit || ""}
                            </strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            Pickup Zone:{" "}
                            <strong className="text-slate-900">
                              {item.location || "Not specified"}
                            </strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                          <Layers className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            Owner Node:{" "}
                            <strong className="text-slate-900">
                              {businessName}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleContact(item, e)}
                        className="w-full inline-flex justify-center items-center space-x-1.5 bg-slate-950 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Send Request</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {contactModal.open && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-950 text-base leading-tight">
                    Contact Supplier
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                    RE:{" "}
                    {contactModal.listing?.materialName ||
                      contactModal.listing?.name}
                  </p>
                </div>

                <button
                  onClick={() => setContactModal({ open: false, listing: null })}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={submitMessage} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Circular Exchange Proposal
                  </label>

                  <textarea
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white p-4 text-xs font-semibold outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setContactModal({ open: false, listing: null })}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-emerald-600 transition-colors shadow"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;