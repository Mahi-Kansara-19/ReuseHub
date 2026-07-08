import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  MapPin, 
  Image as ImageIcon, 
  ArrowLeft, 
  Check, 
  Weight, 
  Coins, 
  Sparkles,
  Phone,
  Mail,
  AlertTriangle,
  Upload,
  RefreshCw,
  Eye
} from "lucide-react";
import { getAllWasteListings, updateWasteListing } from "../services/wasteService";

const STOCK_IMAGES = [
  { url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80", label: "Cardboard & Paper" },
  { url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", label: "Spent Coffee Grounds" },
  { url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", label: "Textiles / Fabrics" },
  { url: "https://images.unsplash.com/photo-1590236065111-a8c3fb58b280?auto=format&fit=crop&w=600&q=80", label: "Wooden Pallets" },
  { url: "https://images.unsplash.com/photo-1526613098299-a37a5b11293a?auto=format&fit=crop&w=600&q=80", label: "Plastic Scrap" },
  { url: "https://images.unsplash.com/photo-1595275372297-a73746995544?auto=format&fit=crop&w=600&q=80", label: "Organic Compost" }
];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    unit: "kg",
    priceType: "Free", // Free, Paid
    priceAmount: "",
    location: "",
    status: "available",
    image: "",
    phone: "",
    email: ""
  });

  const categories = [
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

  const units = ["kg", "tons", "units", "liters", "bags", "pallets"];

  const fetchListingData = async () => {
    try {
      setLoading(true);
      const listings = await getAllWasteListings();
      const listing = listings.find((item) => item._id === id);

      if (!listing) {
        setAlert({ show: true, message: "Material listing not found", type: "error" });
        setTimeout(() => navigate("/my-listings"), 2000);
        return;
      }

      // Extract numeric quantity and unit parts (e.g. "450 kg" -> "450", "kg")
      let qtyPart = "";
      let unitPart = "kg";
      if (listing.quantity) {
        const qtyMatch = listing.quantity.match(/^(\d+(?:\.\d+)?)\s*(\w+)?$/);
        if (qtyMatch) {
          qtyPart = qtyMatch[1];
          if (qtyMatch[2]) {
            unitPart = qtyMatch[2];
          }
        } else {
          qtyPart = parseFloat(listing.quantity) || "";
        }
      }

      // Extract price model type and amount (e.g. "₹35 / kg" -> Paid: 35)
      let pType = "Free";
      let pAmount = "";
      if (listing.price && listing.price.toLowerCase() !== "free") {
        pType = "Paid";
        const priceMatch = listing.price.match(/\d+/);
        pAmount = priceMatch ? priceMatch[0] : "";
      }

      setFormData({
        name: listing.name || "",
        category: listing.category || "",
        description: listing.description || "",
        quantity: qtyPart.toString(),
        unit: unitPart,
        priceType: pType,
        priceAmount: pAmount,
        location: listing.location || "",
        status: listing.availability || "available",
        image: listing.image || "",
        phone: listing.phone || "",
        email: listing.email || ""
      });

    } catch (e) {
      console.error("Error fetching listing details:", e);
      setAlert({ show: true, message: "Error reading listing specifications", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size must be less than 2MB" });
        return;
      }
      setErrors({ ...errors, image: null });
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const stepErrors = {};
    if (!formData.name.trim()) stepErrors.name = "Material name is required";
    if (!formData.category) stepErrors.category = "Category sector is required";
    if (!formData.description.trim()) stepErrors.description = "Description details are required";
    else if (formData.description.length < 20) stepErrors.description = "Please describe the material in more detail (min 20 characters)";
    
    if (!formData.quantity.trim()) stepErrors.quantity = "Quantity value is required";
    if (formData.priceType === "Paid" && (!formData.priceAmount || parseFloat(formData.priceAmount) <= 0)) {
      stepErrors.priceAmount = "Please enter a valid price amount greater than ₹0";
    }
    
    if (!formData.location.trim()) stepErrors.location = "Pickup location is required";
    if (!formData.phone.trim()) stepErrors.phone = "Phone contact is required";
    if (!formData.email.trim()) stepErrors.email = "Email contact is required";

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setAlert({ show: true, message: "Resolve errors before publishing edits.", type: "error" });
      return;
    }

    setSaving(true);
    const finalPrice = formData.priceType === "Free" ? "Free" : `₹${formData.priceAmount} / ${formData.unit}`;

    try {
      await updateWasteListing(id, {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        quantity: `${formData.quantity} ${formData.unit}`,
        location: formData.location,
        price: finalPrice,
        image: formData.image,
        availability: formData.status,
        phone: formData.phone,
        email: formData.email
      });

      setAlert({ show: true, message: "Specifications successfully saved!", type: "success" });
      
      setTimeout(() => {
        setSaving(false);
        navigate("/my-listings");
      }, 1500);

    } catch (err) {
      console.error(err);
      setAlert({ show: true, message: "Failed to persist edits. Please try again.", type: "error" });
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Dynamic Overlay Alerts */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 max-w-md p-4 rounded-2xl shadow-lg border text-sm font-semibold flex items-center space-x-2.5 backdrop-blur-md ${
              alert.type === "success" 
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800" 
                : "bg-rose-50/95 border-rose-200 text-rose-800"
            }`}
          >
            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-white ${alert.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}>
              {alert.type === "success" ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            </div>
            <span>{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8 flex items-center space-x-3">
        <button
          onClick={() => navigate("/my-listings")}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supplier Editor</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mt-0.5">Edit Waste Material</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
          <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-500">Retrieving circular parameters...</p>
        </div>
      ) : (
        /* Edit Form Card */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm relative overflow-hidden">
          {saving && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center flex-col animate-fade-in">
              <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
              <span className="text-xs font-bold text-slate-700">Persisting material records...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Sector A: Basic Specs */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                <FileText className="h-4.5 w-4.5 text-primary" />
                <span>Basic Specifications</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Material Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Waste Material Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary text-slate-800 font-medium ${errors.name ? 'border-rose-300' : 'border-slate-200'}`}
                  />
                  {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.name}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Category Sector
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary text-slate-800 font-semibold cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Status Availability */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Availability Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="available">Available (Discoverable)</option>
                    <option value="pending">Pending Contract</option>
                    <option value="sold">Sold / Reclaimed</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Detailed State Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full rounded-xl border bg-slate-50 focus:bg-white p-4 text-sm outline-none transition-all focus:border-primary text-slate-800 font-medium resize-none leading-relaxed ${errors.description ? 'border-rose-300' : 'border-slate-200'}`}
                  />
                  {errors.description && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Sector B: Logistics & Carbon Valuation */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                <Weight className="h-4.5 w-4.5 text-primary" />
                <span>Logistics & Price Index</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Quantity Volume
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className={`w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary text-slate-800 font-medium ${errors.quantity ? 'border-rose-300' : 'border-slate-200'}`}
                  />
                  {errors.quantity && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.quantity}</p>}
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Unit Category
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary text-slate-800 font-semibold cursor-pointer"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                {/* Pricing Mode buttons */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Pricing Mode
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {["Free", "Paid"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, priceType: type })}
                        className={`py-3 rounded-xl font-bold text-xs border text-center transition-all ${
                          formData.priceType === type 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        {type === "Free" ? "Free / Zero Cost" : "Commercial Price"}
                      </button>
                    ))}
                  </div>

                  {formData.priceType === "Paid" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Coins className="h-4.5 w-4.5" />
                      </div>
                      <input
                        type="number"
                        placeholder={`Price per ${formData.unit} (₹)`}
                        value={formData.priceAmount}
                        onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                        className={`pl-10 w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary text-slate-800 font-medium ${errors.priceAmount ? 'border-rose-300' : 'border-slate-200'}`}
                      />
                      {errors.priceAmount && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.priceAmount}</p>}
                    </motion.div>
                  )}
                </div>

                {/* Pickup Location */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Pickup Hub / Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`pl-10 w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary text-slate-800 font-medium ${errors.location ? 'border-rose-300' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.location && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Sector C: Media & Contacts */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                <ImageIcon className="h-4.5 w-4.5 text-primary" />
                <span>Media & Node Contacts</span>
              </h3>

              <div className="space-y-5">
                {/* Dual upload selectors */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                    Listing Media Photo
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-all relative overflow-hidden group min-h-[110px]">
                      {formData.image ? (
                        <>
                          <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-0" />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center space-x-1">
                              <Upload className="h-3 w-3" />
                              <span>Change Photo</span>
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center pointer-events-none">
                          <Upload className="h-5 w-5 text-slate-400 mb-1.5" />
                          <span className="text-[10px] font-bold text-slate-700 uppercase">Upload Custom Photo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Or select Stock Template:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {STOCK_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: img.url })}
                            className={`relative rounded-lg overflow-hidden h-12 border transition-all ${formData.image === img.url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-slate-300'}`}
                          >
                            <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                            {formData.image === img.url && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white font-extrabold" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Trade Contacts</span>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Direct Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`pl-9 w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold ${errors.phone ? 'border-rose-300' : 'border-slate-200'}`}
                      />
                    </div>
                    {errors.phone && <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Corporate Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`pl-9 w-full rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold ${errors.email ? 'border-rose-300' : 'border-slate-200'}`}
                      />
                    </div>
                    {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* ESG offset banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3 text-emerald-800">
                  <Sparkles className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-950">Carbon Mitigation Calculations</h4>
                    <p className="text-[10px] font-semibold text-emerald-700 mt-1 leading-relaxed">
                      Updating this volume parameters will modify your platform carbon offsets ledger. Offset matches standard EPA indexing coefficients of 2.8 kg CO₂ per kg material.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-end items-center space-x-3 pt-6 border-t border-slate-100 mt-8">
              <button
                type="button"
                onClick={() => navigate("/my-listings")}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-primary hover:bg-emerald-600 transition-colors shadow-md cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Save Specifications</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};

export default EditListing;
