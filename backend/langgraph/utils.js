const getQtyInKg = (listing) => {
  if (!listing) return 0;
  let qty = parseFloat(String(listing.quantity).replace(/[^\d.]/g, ""));
  if (isNaN(qty)) return 0;

  const unit = String(listing.unit || "").toLowerCase().trim();
  if (unit.includes("ton") || unit === "t") {
    return qty * 1000;
  }
  return qty;
};

const getPricePerKg = (listing) => {
  if (!listing) return 0;
  const p = parseFloat(String(listing.price).replace(/[^\d.]/g, ""));
  return isNaN(p) ? 0 : p;
};

module.exports = {
  getQtyInKg,
  getPricePerKg,
};
