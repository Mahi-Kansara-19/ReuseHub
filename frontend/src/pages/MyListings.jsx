import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, 
  Trash2, 
  Plus, 
  Calendar, 
  Weight, 
  Clock, 
  CheckCircle, 
  Inbox, 
  AlertTriangle,
  MapPin,
  ExternalLink
} from "lucide-react";
import { getMyWasteListings, deleteWasteListing } from "../services/wasteService";

const MyListings = () => {
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, listingId: null, listingName: "" });
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  let user = null;
  try {
    const u = localStorage.getItem("user");
    if (u && u !== "undefined") {
      user = JSON.parse(u);
    }
  } catch (e) {
    console.warn("Failed to retrieve user context:", e);
  }

  const fetchOwnListings = async () => {
    try {
      setLoading(true);
      const data = await getMyWasteListings();
      setMyListings(data);
    } catch (e) {
      console.error("Failed to load user listings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnListings();
  }, []);

  const triggerDeleteConfirm = (id, name, e) => {
    e.stopPropagation();
    setDeleteModal({ open: true, listingId: id, listingName: name });
  };

  const handleConfirmDelete = async () => {
    const { listingId } = deleteModal;
    if (!listingId) return;

    try {
      await deleteWasteListing(listingId);
      
      // Update UI state in-place without page refresh
      setMyListings(prev => prev.filter(item => item._id !== listingId));
      
      setAlert({
        show: true,
        message: `Successfully deleted listing "${deleteModal.listingName}".`,
        type: "success"
      });
      
    } catch (err) {
      console.error("Failed to delete listing:", err);
      setAlert({
        show: true,
        message: "Failed to remove listing. Please try again.",
        type: "error"
      });
    } finally {
      setDeleteModal({ open: false, listingId: null, listingName: "" });
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "success" });
      }, 4000);
    }
  };

  const getStatusStyle = (status) => {
    const cleanStatus = (status || "available").toLowerCase();
    switch (cleanStatus) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "sold":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Alert Banners */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-8 p-4 rounded-2xl shadow-sm border text-sm font-semibold flex items-center space-x-2.5 ${
              alert.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-white ${alert.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}>
              {alert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            </div>
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-slate-900 p-8 rounded-3xl text-white border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        
        <div className="z-10">
          <span className="inline-block px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[9px] font-extrabold tracking-wider uppercase mb-3">
            Supplier Console Node
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            My Waste Inventory
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Review, edit specifications, or dissolve listings submitted by <span className="text-emerald-400 font-bold">{user?.businessName || "your business"}</span>.
          </p>
        </div>

        <Link 
          to="/add-listing" 
          className="z-10 inline-flex items-center space-x-1.5 bg-primary hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5 text-xs cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add New Material</span>
        </Link>
      </div>

      {/* Primary listings interface */}
      {loading ? (
        <div className="text-center py-20 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
          <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-500">Querying supplier database index...</p>
        </div>
      ) : myListings.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-sm">
          <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Inventory Found</h3>
          <p className="text-xs text-slate-400 font-medium mt-1 mb-6">You have not registered any circular waste assets with this Supplier Node yet.</p>
          <Link
            to="/add-listing"
            className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm text-xs"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>List First Material</span>
          </Link>
        </div>
      ) : (
        /* Dynamic Hybrid Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Photo header */}
              <div className="h-40 overflow-hidden relative bg-slate-100">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Category Badge overlay */}
                <span className="absolute top-4 left-4 inline-block text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-slate-950/70 text-white backdrop-blur-sm uppercase">
                  {item.category}
                </span>

                {/* Status Badge overlay */}
                <span className={`absolute top-4 right-4 inline-block text-[9px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-sm uppercase ${getStatusStyle(item.availability)}`}>
                  {item.availability || "available"}
                </span>
              </div>

              {/* Specs body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-extrabold text-slate-950 text-base leading-tight truncate">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 font-medium mb-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-slate-100 pt-4 mb-5 text-xs font-semibold text-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Weight className="h-3.5 w-3.5 text-slate-400" />
                      <span>Volume:</span>
                    </div>
                    <span className="text-slate-950 font-bold">{item.quantity}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Listed On:</span>
                    </div>
                    <span className="text-slate-950 font-bold">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>Location:</span>
                    </div>
                    <span className="text-slate-950 font-bold truncate max-w-[150px]">{item.location}</span>
                  </div>
                </div>

                {/* Dashboard Operations CTAs */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate(`/edit-listing/${item._id}`)}
                    className="inline-flex justify-center items-center space-x-1.5 py-2 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit Specs</span>
                  </button>

                  <button
                    onClick={(e) => triggerDeleteConfirm(item._id, item.name, e)}
                    className="inline-flex justify-center items-center space-x-1.5 py-2 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    <span>Delete Asset</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                  <Trash2 className="h-5 w-5" />
                </div>
                
                <h3 className="font-extrabold text-slate-950 text-base leading-tight">
                  Dissolve Circular Asset?
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-2 leading-relaxed">
                  Are you absolutely certain you want to delete listing <strong className="text-slate-900">"{deleteModal.listingName}"</strong>? This will permanently erase the listing and remove it from public marketplace discovery.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setDeleteModal({ open: false, listingId: null, listingName: "" })}
                    className="py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyListings;
