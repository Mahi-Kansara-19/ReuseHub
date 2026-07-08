import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  MapPin, 
  Image as ImageIcon, 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Weight, 
  Coins, 
  Sparkles,
  Phone,
  Mail,
  AlertTriangle,
  Upload,
  RefreshCw
} from "lucide-react";
import { createWasteListing } from "../services/wasteService";

const STOCK_IMAGES = [
  { url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80", label: "Cardboard & Paper" },
  { url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80", label: "Spent Coffee Grounds" },
  { url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", label: "Textiles / Fabrics" },
  { url: "https://images.unsplash.com/photo-1590236065111-a8c3fb58b280?auto=format&fit=crop&w=600&q=80", label: "Wooden Pallets" },
  { url: "https://images.unsplash.com/photo-1526613098299-a37a5b11293a?auto=format&fit=crop&w=600&q=80", label: "Plastic Scrap" },
  { url: "https://images.unsplash.com/photo-1595275372297-a73746995544?auto=format&fit=crop&w=600&q=80", label: "Organic Compost" }
];

const AddListing = () => {
  const navigate = useNavigate();
  
  // Retrieve authenticated user metadata safely
  let user = { businessName: "Supplier Co", location: "Mumbai", phone: "+91 99999 88888", email: "supplier@hub.com" };
  try {
    const u = localStorage.getItem("user");
    if (u && u !== "undefined") {
      user = JSON.parse(u) || user;
    }
  } catch (e) {
    console.warn("Failed to parse user storage in AddListing:", e);
  }

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    location: user.location || "",
    status: "available", // default availability status
    image: STOCK_IMAGES[0].url,
    phone: user.phone || "",
    email: user.email || ""
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

  const validateStep = (currentStep) => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) stepErrors.name = "Material name is required";
      if (!formData.category) stepErrors.category = "Category is required";
      if (!formData.description.trim()) stepErrors.description = "Description is required";
      else if (formData.description.length < 20) stepErrors.description = "Please write a more descriptive state of your material (min 20 chars)";
    } else if (currentStep === 2) {
      if (!formData.quantity.trim()) stepErrors.quantity = "Quantity value is required";
      if (!formData.unit) stepErrors.unit = "Unit selector is required";
      if (formData.priceType === "Paid" && (!formData.priceAmount || parseFloat(formData.priceAmount) <= 0)) {
        stepErrors.priceAmount = "Please enter a valid price greater than ₹0";
      }
      if (!formData.location.trim()) stepErrors.location = "Pickup location is required";
    } else if (currentStep === 3) {
      if (!formData.phone.trim()) stepErrors.phone = "Contact phone is required";
      if (!formData.email.trim()) stepErrors.email = "Contact email is required";
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setAlert({ show: true, message: "Please resolve all form errors before submitting", type: "error" });
      return;
    }

    setLoading(true);
    const finalPrice = formData.priceType === "Free" ? "Free" : `₹${formData.priceAmount} / ${formData.unit}`;
    
    try {
      await createWasteListing({
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

      setAlert({ show: true, message: "Waste material listing added successfully!", type: "success" });
      
      setTimeout(() => {
        setLoading(false);
        navigate("/listings");
      }, 1500);

    } catch (err) {
      console.error(err);
      setAlert({ show: true, message: "Failed to publish listing. Please try again.", type: "error" });
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "Core Details", icon: FileText },
    { num: 2, label: "Volume & Price", icon: Weight },
    { num: 3, label: "Visuals & Contacts", icon: ImageIcon },
    { num: 4, label: "Verification", icon: CheckSquare }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Alert Toast Notification */}
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
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Circular Resource Management
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Publish Waste Material
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          List your commercial scrap or reusable raw materials for businesses to source.
        </p>
      </div>

      {/* Stepper widget */}
      <div className="mb-10 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between relative max-w-xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 pointer-events-none z-0" />
          
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center z-10 relative">
                <button
                  type="button"
                  onClick={() => step > s.num && setStep(s.num)}
                  disabled={step <= s.num}
                  className={`h-10 w-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-white cursor-pointer' 
                      : isActive 
                        ? 'bg-white border-primary text-primary ring-4 ring-primary/10 cursor-default' 
                        : 'bg-white border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4.5 w-4.5" />}
                </button>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm overflow-hidden min-h-[460px] flex flex-col justify-between relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center flex-col">
            <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
            <span className="text-xs font-bold text-slate-700">Indexing waste parameters...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Material Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-grow"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">Material Specifications</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mb-4">Introduce the basic sector categorization and name of your waste.</p>
                </div>

                <div className="space-y-4">
                  {/* Material Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Waste Material Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Spent Craft Brewery Grains"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium ${errors.name ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : 'border-slate-200'}`}
                    />
                    {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Material Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-semibold cursor-pointer ${errors.category ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200'}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.category}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Detailed State & Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Indicate current cleanliness, storage conditions, packaging details, and any specifications that potential buyers should know..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`w-full rounded-xl border bg-slate-50 focus:bg-white p-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium resize-none leading-relaxed ${errors.description ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200'}`}
                    />
                    {errors.description && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.description}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Logistics, Volume & Price */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-grow"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">Logistics & Resource Valuation</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mb-4">Set quantity volumes, price models, and geographical coordinates.</p>
                </div>

                <div className="space-y-4">
                  {/* Quantity & Unit */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                        Quantity Volume
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Weight className="h-4.5 w-4.5" />
                        </div>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 350"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className={`pl-10 w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium ${errors.quantity ? 'border-rose-300' : 'border-slate-200'}`}
                        />
                      </div>
                      {errors.quantity && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.quantity}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                        Unit
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-semibold cursor-pointer"
                      >
                        {units.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pricing Model */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Pricing Model
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
                          {type === "Free" ? "Free / Donation" : "Commercial Sale"}
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
                          className={`pl-10 w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium ${errors.priceAmount ? 'border-rose-300' : 'border-slate-200'}`}
                        />
                        {errors.priceAmount && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.priceAmount}</p>}
                      </motion.div>
                    )}
                  </div>

                  {/* Pickup Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Pickup Address / Hub Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="h-4.5 w-4.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Sector-15 Hub, Thane, Mumbai"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className={`pl-10 w-full rounded-xl border bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium ${errors.location ? 'border-rose-300' : 'border-slate-200'}`}
                      />
                    </div>
                    {errors.location && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.location}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Visual Representaton & Contacts */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-grow"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">Visual representation & Contacts</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mb-4">Choose a stock template image, upload a custom photo, and verify contacts.</p>
                </div>

                <div className="space-y-5">
                  
                  {/* Custom Upload & Stock selector toggle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Material Media / Image
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-all relative overflow-hidden group min-h-[110px]">
                        {formData.image && formData.image.startsWith("data:") ? (
                          <>
                            <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-0" />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10">
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center space-x-1">
                                <Upload className="h-3 w-3" />
                                <span>Replace File</span>
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center pointer-events-none">
                            <Upload className="h-5 w-5 text-slate-400 mb-1.5" />
                            <span className="text-[10px] font-bold text-slate-700 uppercase">Upload Custom Photo</span>
                            <span className="text-[9px] text-slate-400 font-semibold mt-0.5">JPEG/PNG under 2MB</span>
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
                    {errors.image && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.image}</p>}
                  </div>

                  {/* Prefilled Contact Details */}
                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Verified Node Contacts</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Direct Phone</label>
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
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Corporate Email</label>
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
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Verification & ESG Carbon Offsets */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-grow"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">Circular Compliance Index</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mb-4">Review all compiled parameters prior to blockchain ledger indexing.</p>
                </div>

                <div className="space-y-4">
                  {/* Summary Grid */}
                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-3.5 text-xs font-semibold">
                    <div className="flex justify-between items-start pb-2 border-b border-slate-200/30">
                      <span className="text-slate-400">Material Name:</span>
                      <span className="text-slate-950 text-right font-bold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/30">
                      <span className="text-slate-400">Category Sector:</span>
                      <span className="text-slate-950 text-right font-bold">{formData.category}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/30">
                      <span className="text-slate-400">Volume Indexed:</span>
                      <span className="text-slate-950 text-right font-extrabold text-slate-900">{formData.quantity} {formData.unit}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/30">
                      <span className="text-slate-400">Trading Model:</span>
                      <span className="text-slate-950 text-right font-extrabold text-primary">
                        {formData.priceType === "Free" ? "Free / Donation" : `₹${formData.priceAmount} / ${formData.unit}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/30">
                      <span className="text-slate-400">Availability:</span>
                      <span className="text-slate-950 text-right font-bold capitalize text-slate-900">{formData.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Pickup Node:</span>
                      <span className="text-slate-950 text-right font-bold truncate max-w-[200px]">{formData.location}</span>
                    </div>
                  </div>

                  {/* CO2 offset estimation card */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3 text-emerald-800">
                    <Sparkles className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-950">Landfill Carbon Mitigation</h4>
                      <p className="text-[10px] font-semibold text-emerald-700 mt-1 leading-relaxed">
                        By listing these resources, you will offset an estimated <strong className="text-emerald-950">
                          {parseFloat(formData.quantity) 
                            ? Math.round(parseFloat(formData.quantity) * 2.8) 
                            : 0} kg of CO₂ emissions
                        </strong> from landfill dumps (calculated using standard EPA circular indexes of 2.8 kg CO₂ per kg material).
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className="inline-flex items-center space-x-1.5 py-2.5 px-5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center space-x-1.5 py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-primary hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 py-2.5 px-7 rounded-xl text-xs font-bold text-white bg-primary hover:bg-emerald-600 transition-all shadow-md cursor-pointer"
              >
                <Check className="h-4.5 w-4.5 animate-bounce" />
                <span>Publish Listing</span>
              </button>
            )}
          </div>

        </form>
      </div>

    </div>
  );
};

export default AddListing;
