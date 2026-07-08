import { useEffect, useState } from "react";
import {
  getMyDemands,
  updateDemand,
  deleteDemand,
} from "../services/demandService";


const MyDemands = () => {
  const [demands, setDemands] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState("");

  const fetchMyDemands = async () => {
    try {
      const data = await getMyDemands();
      setDemands(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load demands");
    }
  };

  useEffect(() => {
    fetchMyDemands();
  }, []);

  const startEdit = (demand) => {
    setEditingId(demand._id);
    setEditData({
      materialName: demand.materialName,
      category: demand.category,
      quantity: demand.quantity,
      unit: demand.unit,
      description: demand.description,
      location: demand.location,
      phone: demand.phone,
      email: demand.email,
      neededBy: demand.neededBy,
      status: demand.status,
    });
  };

  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveUpdate = async (id) => {
    try {
      await updateDemand(id, editData);
      setEditingId(null);
      setMessage("Demand updated successfully!");
      fetchMyDemands();
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    }
  };

  const removeDemand = async (id) => {
    if (!window.confirm("Are you sure you want to delete this demand?")) return;

    try {
      await deleteDemand(id);
      setMessage("Demand deleted successfully!");
      fetchMyDemands();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="demand-page">
      <div className="demand-header">
        <h2>My Demands</h2>
        <p>Manage demands raised by you.</p>
      </div>

      {message && <div className="demand-message">{message}</div>}

      {demands.length === 0 ? (
        <p>You have not raised any demand yet.</p>
      ) : (
        <div className="demand-grid">
          {demands.map((demand) => (
            <div className="demand-card" key={demand._id}>
              {editingId === demand._id ? (
                <>
                  <input name="materialName" value={editData.materialName} onChange={handleChange} />
                  <input name="category" value={editData.category} onChange={handleChange} />

                  <div className="demand-row">
                    <input name="quantity" value={editData.quantity} onChange={handleChange} />
                    <select name="unit" value={editData.unit} onChange={handleChange}>
                      <option value="kg">Kg</option>
                      <option value="ton">Ton</option>
                      <option value="litre">Litre</option>
                      <option value="pieces">Pieces</option>
                      <option value="bags">Bags</option>
                    </select>
                  </div>

                  <textarea name="description" value={editData.description} onChange={handleChange} />
                  <input name="location" value={editData.location} onChange={handleChange} />
                  <input name="phone" value={editData.phone} onChange={handleChange} />
                  <input name="email" value={editData.email} onChange={handleChange} />
                  <input type="date" name="neededBy" value={editData.neededBy} onChange={handleChange} />

                  <select name="status" value={editData.status} onChange={handleChange}>
                    <option value="open">Open</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="closed">Closed</option>
                  </select>

                  <div className="demand-actions">
                    <button onClick={() => saveUpdate(demand._id)}>Save</button>
                    <button className="secondary-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="demand-card-top">
                    <h3>{demand.materialName}</h3>
                    <span>{demand.status}</span>
                  </div>

                  <p><strong>Category:</strong> {demand.category}</p>
                  <p><strong>Quantity:</strong> {demand.quantity} {demand.unit}</p>
                  <p><strong>Location:</strong> {demand.location}</p>
                  <p><strong>Needed By:</strong> {demand.neededBy}</p>
                  <p><strong>Phone:</strong> {demand.phone}</p>
                  <p><strong>Email:</strong> {demand.email}</p>
                  <p className="demand-desc">{demand.description}</p>

                  <div className="demand-actions">
                    <button onClick={() => startEdit(demand)}>Edit</button>
                    <button className="danger-btn" onClick={() => removeDemand(demand._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDemands;