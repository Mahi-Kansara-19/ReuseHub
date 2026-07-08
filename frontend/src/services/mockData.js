// Mock data store for ReuseHub using a robust Hybrid Persistence Engine.
// Supports safe localStorage parsing and automatic in-memory fallbacks if storage is restricted or corrupted.

const DEFAULT_LISTINGS = [
  {
    id: "lst_1",
    name: "Dry Corrugated Cardboard Boxes",
    category: "Packaging Business",
    quantity: "450 kg",
    location: "Mumbai, Maharashtra",
    price: "Free",
    businessName: "Apex Packagers Ltd",
    ownerName: "Anil Sharma",
    phone: "+91 98765 43210",
    email: "anil@apexpack.com",
    description: "Flat-packed, single-use corrugated cardboard boxes. Kept in a dry, clean warehouse. Ideal for shipping or secondary packaging needs.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
    co2Saved: 1440,
    createdAt: "2026-05-15T10:00:00Z"
  },
  {
    id: "lst_2",
    name: "Spent Espresso Coffee Grounds",
    category: "Cafe & Restaurant",
    quantity: "120 kg",
    location: "Pune, Maharashtra",
    price: "Free",
    businessName: "Brews & Beans Café",
    ownerName: "Sarah D'Souza",
    phone: "+91 91234 56789",
    email: "sarah@brewsandbeans.com",
    description: "High-nitrogen organic coffee grounds collected daily from espresso prep. Excellent for organic farming, gardening, soil conditioning, or natural dyes.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    co2Saved: 380,
    createdAt: "2026-05-20T14:30:00Z"
  },
  {
    id: "lst_3",
    name: "Assorted Cotton Textile Offcuts",
    category: "Tailoring & Textile Shop",
    quantity: "85 kg",
    location: "Ahmedabad, Gujarat",
    price: "₹35 / kg",
    businessName: "Heritage Weaves",
    ownerName: "Rajesh Patel",
    phone: "+91 99887 76655",
    email: "rajesh@heritageweaves.com",
    description: "Premium pure cotton fabric offcuts in mixed colors and patterns. Sized mostly between 10cm and 50cm. Excellent for quilting, doll stuffing, or paper-making.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    co2Saved: 280,
    createdAt: "2026-05-22T09:15:00Z"
  },
  {
    id: "lst_4",
    name: "Sturdy Pine Wood Pallets",
    category: "Workshop & Carpentry",
    quantity: "40 units",
    location: "Bangalore, Karnataka",
    price: "₹120 / unit",
    businessName: "TimberCraft Studios",
    ownerName: "Vikram Rao",
    phone: "+91 88776 65544",
    email: "vikram@timbercraft.com",
    description: "Standard industrial wooden pallets made of untreated pine wood. Structural integrity is perfect. Great for warehouse storage, heavy shipping, or custom pallet furniture.",
    image: "https://images.unsplash.com/photo-1590236065111-a8c3fb58b280?auto=format&fit=crop&w=600&q=80",
    co2Saved: 680,
    createdAt: "2026-05-25T11:45:00Z"
  },
  {
    id: "lst_5",
    name: "Premium Clean PET Flakes",
    category: "Recycling Unit",
    quantity: "900 kg",
    location: "Surat, Gujarat",
    price: "₹28 / kg",
    businessName: "EcoCycle Solutions",
    ownerName: "Mahesh Mehta",
    phone: "+91 77665 54433",
    email: "mahesh@ecocycle.in",
    description: "Crushed, hot-washed, and friction-dried clear polyethylene terephthalate (PET) bottle flakes. Bulk density is perfect for immediate extrusion or pelletizing.",
    image: "https://images.unsplash.com/photo-1526613098299-a37a5b11293a?auto=format&fit=crop&w=600&q=80",
    co2Saved: 2700,
    createdAt: "2026-05-28T16:00:00Z"
  }
];

const DEFAULT_DEMANDS = [
  {
    id: "dem_1",
    materialName: "Cardboard Packaging",
    category: "Packaging Business",
    quantityNeeded: "50000 kg",
    location: "Mumbai",
    buyerBusiness: "GreenCart Eco solutions",
    status: "open",
    createdAt: "2026-05-18T08:00:00Z"
  },
  {
    id: "dem_2",
    materialName: "Textile Waste / Fabric Scraps",
    category: "Tailoring & Textile Shop",
    quantityNeeded: "50000 kg",
    location: "Ahmedabad",
    buyerBusiness: "Upcycled Cotton Artisans",
    status: "matched",
    createdAt: "2026-05-24T12:00:00Z"
  }
];

const DEFAULT_MONTHLY_DATA = [
  { month: "Dec", weight: 450, co2: 1200, exchanges: 8 },
  { month: "Jan", weight: 680, co2: 1800, exchanges: 12 },
  { month: "Feb", weight: 920, co2: 2450, exchanges: 15 },
  { month: "Mar", weight: 1100, co2: 2900, exchanges: 21 },
  { month: "Apr", weight: 1400, co2: 3700, exchanges: 28 },
  { month: "May", weight: 1695, co2: 5480, exchanges: 36 }
];

const DEFAULT_CATEGORY_DATA = [
  { name: "Packaging", value: 35, color: "#4A7538" },
  { name: "Textiles", value: 20, color: "#14B8A6" },
  { name: "Organic Waste", value: 25, color: "#3B82F6" },
  { name: "Wood & Timber", value: 12, color: "#F59E0B" },
  { name: "Other", value: 8, color: "#64748B" }
];

// Fallback in-memory state arrays
let memoryListings = [...DEFAULT_LISTINGS];
let memoryDemands = [...DEFAULT_DEMANDS];
let memoryFavorites = ["lst_2"];
let memoryMessages = [];

// Clean detection of localStorage support
const isLocalStorageAvailable = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "__rh_test_key__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const hasLocalStorage = isLocalStorageAvailable();

// Safety-wrapped localStorage initializations
const initStorage = () => {
  if (!hasLocalStorage) return;

  try {
    const list = localStorage.getItem("rh_listings");
    if (!list || list === "undefined") {
      localStorage.setItem("rh_listings", JSON.stringify(DEFAULT_LISTINGS));
    } else {
      JSON.parse(list); // Validate it's parsed successfully
    }
  } catch (e) {
    try { localStorage.setItem("rh_listings", JSON.stringify(DEFAULT_LISTINGS)); } catch (_) {}
  }

  try {
    const dem = localStorage.getItem("rh_demands");
    if (!dem || dem === "undefined") {
      localStorage.setItem("rh_demands", JSON.stringify(DEFAULT_DEMANDS));
    } else {
      JSON.parse(dem);
    }
  } catch (e) {
    try { localStorage.setItem("rh_demands", JSON.stringify(DEFAULT_DEMANDS)); } catch (_) {}
  }

  try {
    const fav = localStorage.getItem("rh_favorites");
    if (!fav || fav === "undefined") {
      localStorage.setItem("rh_favorites", JSON.stringify(["lst_2"]));
    } else {
      JSON.parse(fav);
    }
  } catch (e) {
    try { localStorage.setItem("rh_favorites", JSON.stringify(["lst_2"])); } catch (_) {}
  }

  try {
    const msg = localStorage.getItem("rh_messages");
    if (!msg || msg === "undefined") {
      localStorage.setItem("rh_messages", JSON.stringify([]));
    } else {
      JSON.parse(msg);
    }
  } catch (e) {
    try { localStorage.setItem("rh_messages", JSON.stringify([])); } catch (_) {}
  }
};

// Immediately invoke storage initialization
initStorage();

export const mockDataService = {
  // Listings
  getListings: () => {
    initStorage();
    if (hasLocalStorage) {
      try {
        const list = localStorage.getItem("rh_listings");
        if (list && list !== "undefined") {
          return JSON.parse(list);
        }
      } catch (e) {
        console.warn("Failed to parse rh_listings, falling back to memory:", e);
      }
    }
    return memoryListings;
  },
  
  addListing: (listing) => {
    initStorage();
    const newListing = {
      id: `lst_${Date.now()}`,
      createdAt: new Date().toISOString(),
      co2Saved: parseFloat(listing.quantity) * 2.8 || 200,
      ...listing
    };

    if (hasLocalStorage) {
      try {
        const listStr = localStorage.getItem("rh_listings");
        const listings = (listStr && listStr !== "undefined") ? JSON.parse(listStr) : [];
        listings.unshift(newListing);
        localStorage.setItem("rh_listings", JSON.stringify(listings));
      } catch (e) {
        console.warn("Failed to write new listing to localStorage, falling back to memory:", e);
      }
    }
    
    memoryListings.unshift(newListing);
    return newListing;
  },
  
  deleteListing: (id) => {
    initStorage();
    if (hasLocalStorage) {
      try {
        const listStr = localStorage.getItem("rh_listings");
        let listings = (listStr && listStr !== "undefined") ? JSON.parse(listStr) : [];
        listings = listings.filter(l => l.id !== id);
        localStorage.setItem("rh_listings", JSON.stringify(listings));
      } catch (e) {
        console.warn("Failed to delete listing from localStorage, falling back to memory:", e);
      }
    }
    memoryListings = memoryListings.filter(l => l.id !== id);
    return true;
  },

  updateListing: (id, updatedFields) => {
    initStorage();
    let updatedListing = null;
    if (hasLocalStorage) {
      try {
        const listStr = localStorage.getItem("rh_listings");
        let listings = (listStr && listStr !== "undefined") ? JSON.parse(listStr) : [];
        listings = listings.map(l => {
          if (l.id === id) {
            updatedListing = { ...l, ...updatedFields };
            return updatedListing;
          }
          return l;
        });
        localStorage.setItem("rh_listings", JSON.stringify(listings));
      } catch (e) {
        console.warn("Failed to update listing in localStorage, falling back to memory:", e);
      }
    }
    
    memoryListings = memoryListings.map(l => {
      if (l.id === id) {
        const updated = { ...l, ...updatedFields };
        if (!updatedListing) updatedListing = updated;
        return updated;
      }
      return l;
    });
    return updatedListing;
  },

  // Favorites
  getFavorites: () => {
    initStorage();
    if (hasLocalStorage) {
      try {
        const favs = localStorage.getItem("rh_favorites");
        if (favs && favs !== "undefined") {
          return JSON.parse(favs);
        }
      } catch (e) {
        console.warn("Failed to read rh_favorites, falling back to memory:", e);
      }
    }
    return memoryFavorites;
  },

  toggleFavorite: (id) => {
    initStorage();
    let newFavs = [];

    if (hasLocalStorage) {
      try {
        const favsStr = localStorage.getItem("rh_favorites");
        const favs = (favsStr && favsStr !== "undefined") ? JSON.parse(favsStr) : [];
        if (favs.includes(id)) {
          newFavs = favs.filter(favId => favId !== id);
        } else {
          newFavs = [...favs, id];
        }
        localStorage.setItem("rh_favorites", JSON.stringify(newFavs));
        memoryFavorites = newFavs;
        return newFavs;
      } catch (e) {
        console.warn("Failed to write favorites, falling back to memory:", e);
      }
    }
    
    if (memoryFavorites.includes(id)) {
      newFavs = memoryFavorites.filter(favId => favId !== id);
    } else {
      newFavs = [...memoryFavorites, id];
    }
    memoryFavorites = newFavs;
    return newFavs;
  },

  // Demands
  getDemands: () => {
    initStorage();
    if (hasLocalStorage) {
      try {
        const dems = localStorage.getItem("rh_demands");
        if (dems && dems !== "undefined") {
          return JSON.parse(dems);
        }
      } catch (e) {
        console.warn("Failed to parse rh_demands, falling back to memory:", e);
      }
    }
    return memoryDemands;
  },

  addDemand: (demand) => {
    initStorage();
    const newDemand = {
      id: `dem_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "open",
      ...demand
    };

    if (hasLocalStorage) {
      try {
        const demsStr = localStorage.getItem("rh_demands");
        const demands = (demsStr && demsStr !== "undefined") ? JSON.parse(demsStr) : [];
        demands.unshift(newDemand);
        localStorage.setItem("rh_demands", JSON.stringify(demands));
      } catch (e) {
        console.warn("Failed to write demand, falling back to memory:", e);
      }
    }
    
    memoryDemands.unshift(newDemand);
    return newDemand;
  },

  // Messages
  getMessages: () => {
    initStorage();
    if (hasLocalStorage) {
      try {
        const msgs = localStorage.getItem("rh_messages");
        if (msgs && msgs !== "undefined") {
          return JSON.parse(msgs);
        }
      } catch (e) {
        console.warn("Failed to parse messages, falling back to memory:", e);
      }
    }
    return memoryMessages;
  },

  sendMessage: (message) => {
    initStorage();
    const newMessage = {
      id: `msg_${Date.now()}`,
      sentAt: new Date().toISOString(),
      ...message
    };

    if (hasLocalStorage) {
      try {
        const msgsStr = localStorage.getItem("rh_messages");
        const messages = (msgsStr && msgsStr !== "undefined") ? JSON.parse(msgsStr) : [];
        messages.push(newMessage);
        localStorage.setItem("rh_messages", JSON.stringify(messages));
      } catch (e) {
        console.warn("Failed to save message, falling back to memory:", e);
      }
    }
    
    memoryMessages.push(newMessage);
    return newMessage;
  },

  getMonthlyData: () => DEFAULT_MONTHLY_DATA,
  
  getCategoryData: () => DEFAULT_CATEGORY_DATA,
  
  getGlobalStats: () => {
    const listings = mockDataService.getListings();
    const demands = mockDataService.getDemands();
    
    const totalListings = listings ? listings.length : 0;
    const totalDemands = demands ? demands.length : 0;
    const totalCO2 = (listings ? listings.reduce((sum, l) => sum + (l.co2Saved || 0), 0) : 0) + 5480;
    const totalExchanged = 36 + (totalListings - DEFAULT_LISTINGS.length);

    return {
      businessesRegistered: 48,
      wasteReused: `${totalExchanged * 150} kg`,
      co2Saved: `${totalCO2} kg`,
      activeListings: totalListings,
      totalExchanges: totalExchanged,
      totalDemands: totalDemands
    };
  }
};
