const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

console.log("=== ReuseHub Backend Audit Version ===");
console.log("process.env.FRONTEND_URL on load:", process.env.FRONTEND_URL);

connectDB();

const app = express();

// Temporary request-logging middleware
app.use((req, res, next) => {
  console.log(`[AUDIT LOG] ${req.method} ${req.url}`);
  console.log(`[AUDIT LOG] Origin Header: ${req.headers.origin}`);
  console.log(`[AUDIT LOG] Referer: ${req.headers.referer}`);
  next();
});

// ---------------------- CORS CONFIGURATION ----------------------

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log("========== CORS CONFIG ==========");
console.log("FRONTEND_URL ENV:", process.env.FRONTEND_URL);
console.log("Allowed Origins:", allowedOrigins);
console.log("Google Client ID loaded:", process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 15) + "..." : "undefined");
console.log("=================================");

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("[CORS Check] Incoming Origin:", origin);

      // Allow requests without origin (Postman, Render health checks, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("✅ Origin Allowed");
        return callback(null, true);
      }

      console.log("❌ Origin Blocked:", origin);
      return callback(null, false);
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

// ---------------------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core API Routes
app.use("/api/auth", require("./routes/authRoutes"));
//app.use("/api/auth", require("./routes/googleAuthRoutes")); // Google Passport Auth Routes
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/demands", require("./routes/demandRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/ai", require("./routes/ai.routes"));

app.get("/", (req, res) => {
  res.send("ReuseHub API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});