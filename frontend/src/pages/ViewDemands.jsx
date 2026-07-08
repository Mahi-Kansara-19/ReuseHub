import { useEffect, useState } from "react";
import { getAllDemands } from "../services/demandService";

const ViewDemands = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAllDemands()
      .then((data) => {
        if (active) {
          setDemands(data);
        }
      })
      .catch((error) => {
        console.log("Get demands error:", error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="demand-page">
      <div className="demand-header">
        <h2><b>View Demands</b></h2>
        <p>Browse requirements posted by buyers.</p>
      </div>

      {loading ? (
        <p>Loading demands...</p>
      ) : demands.length === 0 ? (
        <p>No demands found.</p>
      ) : (
        <div className="demand-grid">
          {demands.map((demand) => (
            <div className="demand-card" key={demand._id}>
              <div className="demand-card-top">
                <h3>{demand.materialName}</h3>
                <span>
                {demand.status}</span>
              </div>

              <p><strong>Category:</strong> {demand.category}</p>
              <p><strong>Quantity:</strong> {demand.quantity} {demand.unit}</p>
              <p><strong>Location:</strong> {demand.location}</p>
              <p><strong>Needed By:</strong> {demand.neededBy}</p>
              <p><strong>Business:</strong> {demand.businessName}</p>
              <p><strong>Phone:</strong> {demand.phone}</p>
              <p><strong>Email:</strong> {demand.email}</p>
              <p className="demand-desc">{demand.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewDemands;