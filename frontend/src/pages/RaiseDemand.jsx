import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDemand } from "../services/demandService";

const RaiseDemand = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    materialName: "",
    category: "",
    quantity: "",
    unit: "kg",
    description: "",
    location: "",
    phone: "",
    email: "",
    neededBy: "",
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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await createDemand(formData);
      setMessage("Demand raised successfully!");
      setTimeout(() => navigate("/my-demands"), 800);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demand-page">
      <div className="demand-form-card">
        <h2>Raise Demand</h2>
        <p>Post the material you need from suppliers.</p>

        {message && <div className="demand-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="materialName"
            placeholder="Material Name"
            value={formData.materialName}
            onChange={handleChange}
            required
          />

        <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  required
>
  <option value="">Select Category</option>

  {categories.map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>

          <div className="demand-row">
            <input
              type="text"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />

            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option value="kg">Kg</option>
              <option value="ton">Ton</option>
              <option value="litre">Litre</option>
              <option value="pieces">Pieces</option>
              <option value="bags">Bags</option>
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Describe your requirement"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <div className="demand-row">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <label className="demand-label">Needed By</label>
          <input
            type="date"
            name="neededBy"
            value={formData.neededBy}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Raise Demand"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseDemand;