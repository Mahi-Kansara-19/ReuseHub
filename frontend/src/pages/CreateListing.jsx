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
  Info
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

const CreateListing = () => {
  const navigate = useNavigate();
  let user = { businessName: "Supplier Co", location: "Mumbai" };
  try {
    const u = localStorage.getItem("user");
    if (u && u !== "undefined") {
      user = JSON.parse(u) || user;
    }
  } catch (e) {
    console.warn("Failed to parse user storage in CreateListing:", e);
  }

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    priceType: "Free", // Free, Paid
    priceAmount: "",
    location: user.location || "",
    image: STOCK_IMAGES[0].url
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

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const finalPrice = formData.priceType === "Free" ? "Free" : `₹${formData.priceAmount} / kg`;
    
    try {
      await createWasteListing({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        quantity: formData.quantity,
        location: formData.location,
        price: finalPrice,
        image: formData.image,
        phone: user.phone || "+91 99999 88888",
        email: user.email || "supplier@hub.com"
      });
      navigate("/marketplace");
    } catch (err) {
      console.error("Failed to create waste listing:", err);
      setError(err.response?.data?.message || err.message || "Failed to publish listing. Please try again.");
      setStep(4); // Keep them on confirmation screen to see the error
    } finally {
      setLoading(false);
    }
  };

  // Stepper UI configuration
  const steps = [
    { num: 1, label: "Details", icon: FileText },
    { num: 2, label: "Logistics", icon: MapPin },
    { num: 3, label: "Visuals", icon: ImageIcon },
    { num: 4, label: "Confirm", icon: CheckSquare }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Material Onboarding
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Reuse Listing
        </h1>
      </div>

      {/* Stepper Widget */}
      <div className="mb-10 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between relative max-w-xl mx-auto">
          {/* Stepper line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 pointer-events-none z-0" />
          
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center z-10 relative">
                <div 
                  className={`h-10 w-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary border-primary text-white' 
                      : isActive 
                        ? 'bg-white border-primary text-primary ring-4 ring-primary/10' 
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4.5 w-4.5" />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm overflow-hidden min-h-[420px] flex flex-col justify-between">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* Step 1: Material Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-grow"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">Material Specifications</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mb-4">Provide details about the scrap or offcut material.</p>
                </div>

                <div className="space-y-4">
                  {/* Material Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Listing Title / Material Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dry Double-Wall Cardboard Boxes"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Business Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-semibold cursor-pointer"
                    >
                      <option value="" className="text-slate-400">Select Category</option>
                      {categories.map((c) => (
                        <option key={c} value={c} className="text-slate-800 font-semibold">{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Detailed Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Specify material state, moisture level, packaging layout, dry warehouse storage variables, etc..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white p-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Logistics & Pricing */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-grow"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">Volume & Logistics</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mb-4">Set quantity volumes, price models, and pickup zones.</p>
                </div>

                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider flex items-center justify-between">
                      <span>Total Volume / Quantity</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase normal-case">Specify unit (e.g. 150 kg, 30 units)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Weight className="h-4.5 w-4.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 250 kg"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                        className="pl-10 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                      />
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
                          {type === "Free" ? "Free / Zero Cost" : "Paid Transfer"}
                        </button>
                      ))}
                    </div>

                    {formData.priceType === "Paid" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Coins className="h-4.5 w-4.5" />
                        </div>
                        <input
                          type="number"
                          placeholder="Price per unit (INR)"
                          value={formData.priceAmount}
                          onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                          required={formData.priceType === "Paid"}
                          className="pl-10 w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Pickup Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2 tracking-wider">
                      Pickup Hub / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Andheri East, Mumbai"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-800 font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Images */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-grow animate-all"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">Visual Representation</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mb-4">Select the stock category image that best fits your waste type.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {STOCK_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      className={`relative rounded-2xl overflow-hidden border-2 text-left h-28 group transition-all ${
                        formData.image === img.url 
                          ? 'border-primary ring-4 ring-primary/10' 
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-bold text-white leading-tight">
                          {img.label}
                        </span>
                      </div>
                      
                      {formData.image === img.url && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Review and Submit */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 flex-grow"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-1">Final ESG Valuation</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mb-4">Review all parameters and submit to the circular index.</p>
                </div>

                <div className="space-y-4">
                  {/* Summary Grid */}
                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-3.5 text-xs font-semibold">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                      <span className="text-slate-400">Material Name:</span>
                      <span className="text-slate-950 text-right">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                      <span className="text-slate-400">Sector Category:</span>
                      <span className="text-slate-950 text-right">{formData.category}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                      <span className="text-slate-400">Trading volume:</span>
                      <span className="text-slate-950 text-right">{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                      <span className="text-slate-400">Pricing Model:</span>
                      <span className="text-slate-950 text-right font-extrabold">
                        {formData.priceType === "Free" ? "Free / Zero Cost" : `₹${formData.priceAmount} / kg`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Pickup Hub:</span>
                      <span className="text-slate-950 text-right">{formData.location}</span>
                    </div>
                  </div>

                  {/* ESG carbon offset card */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3 text-emerald-800">
                    <Sparkles className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-950">Environmental Impact Valuation</h4>
                      <p className="text-[10px] font-semibold text-emerald-700 mt-1 leading-relaxed">
                        Completing this exchange will offset an estimated <strong className="text-emerald-950">
                          {parseFloat(formData.quantity) 
                            ? Math.round(parseFloat(formData.quantity) * 2.8) 
                            : 280} kg of CO₂
                        </strong> from regional landfills (based on a standard coefficient factor of 2.8 kg CO₂ / kg material).
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Buttons Control */}
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
                disabled={
                  (step === 1 && (!formData.name || !formData.category || !formData.description)) ||
                  (step === 2 && (!formData.quantity || !formData.location || (formData.priceType === "Paid" && !formData.priceAmount)))
                }
                className="inline-flex items-center space-x-1.5 py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-primary hover:bg-emerald-600 transition-colors disabled:opacity-35 disabled:cursor-not-allowed shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-1.5 py-2.5 px-7 rounded-xl text-xs font-bold text-white bg-primary hover:bg-emerald-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4.5 w-4.5" />
                    <span>Confirm & Publish Listing</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
