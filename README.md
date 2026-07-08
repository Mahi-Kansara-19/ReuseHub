# ♻️ ReuseHub

### 🌍 AI-Powered Circular Economy & Smart Waste Recycling Marketplace

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)
![License](https://img.shields.io/badge/License-ISC-blue)

ReuseHub is a comprehensive AI-powered web platform that bridges the gap between waste suppliers (businesses with recyclable industrial or commercial waste) and buyers (recyclers and manufacturing units looking for secondary raw materials).

The platform promotes a circular economy by helping businesses reuse valuable waste instead of sending it to landfills. Using a custom Multi-Agent LangGraph workflow, ReuseHub analyzes waste listings, recommends pricing, calculates sustainability metrics, ranks potential buyers, and generates official sustainability certificates.

---

# 🚀 Live Demo

### 🌐 Frontend

https://reuse-hub-neon.vercel.app

### ⚙️ Backend API

https://reusehub-nfqo.onrender.com

---

# ✨ Features

## 👤 Authentication

- Secure JWT Authentication
- Google Sign-In
- Password Encryption using bcrypt
- Forgot Password via Email
- Role-based Authentication
- Profile Management

---

## 🏭 Supplier Features

- Create Waste Listings
- Upload Waste Details
- Manage Listings
- View Dashboard
- AI Waste Analysis
- Price Recommendation
- Sustainability Score
- Carbon Offset Calculation
- Generate Sustainability Certificates
- Download Printable PDF Certificates

---

## 🛒 Buyer Features

- Register Material Demands
- Browse Marketplace
- Search Listings
- Filter by Category
- Filter by Location
- Match with Suppliers
- View AI Ranked Matches

---

## 🤖 AI Features

- Listing Validation
- Waste Quality Analysis
- AI Buyer Matching
- Buyer Ranking
- Smart Price Recommendation
- Carbon Emission Savings
- Landfill Reduction Estimation
- Sustainability Insights
- Recommendation Explanation

---

## 📊 Dashboard & Analytics

- Monthly Waste Statistics
- Category-wise Charts
- Total Waste Recycled
- CO₂ Saved
- Active Listings
- Successful Matches
- Public Sustainability Statistics

---

## 📧 Additional Features

- Contact Form
- Email Notifications
- QR Verified Certificates
- Responsive Design
- Modern Animations
- Admin Dashboard

---

# 🛠️ Technology Stack

## Frontend

- React 19
- Vite
- Tailwind CSS v4
- Framer Motion
- Axios
- Lucide React
- Recharts
- jsPDF
- html-to-image
- react-to-print
- Google OAuth

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Passport.js
- Google OAuth
- Nodemailer
- LangChain
- LangGraph

---

## Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- MongoDB Atlas

---

# 🧠 LangGraph Multi-Agent Workflow

ReuseHub uses a custom **LangGraph StateGraph** workflow to analyze every waste listing before recommending potential buyers.

The workflow consists of multiple specialized AI agents:

### 1. Listing Validator

- Validates mandatory fields
- Checks duplicate listings
- Verifies quantity ranges
- Detects unrealistic pricing

### 2. Waste Analysis Agent

- Identifies waste category
- Grades recyclability
- Calculates waste quality score
- Assigns sustainability rating

### 3. Buyer Matcher

- Searches buyer demands
- Matches waste categories
- Allows ±100 kg quantity flexibility

### 4. Buyer Ranking Agent

Ranks buyers using:

- Category Match
- Quantity Similarity
- Historical Match Success
- Sustainability Priority

### 5. Price Recommendation Agent

Calculates:

- Recommended Price/kg
- Bulk Discounts
- Market Demand Analysis
- Historical Pricing

### 6. Sustainability Agent

Calculates:

- Carbon Emissions Saved
- Landfill Reduction
- Environmental Impact Score

### 7. Recommendation Agent

Combines all previous results and stores:

- AI Recommendation
- Match Score
- Sustainability Metrics
- Final Reasoning

# 📁 Repository Structure

```
ReuseHub/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── aiController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── certificateController.js
│   │   ├── contactController.js
│   │   ├── demandController.js
│   │   ├── listingController.js
│   │   └── matchController.js
│   │
│   ├── langgraph/
│   │   ├── graph.js
│   │   ├── state.js
│   │   ├── utils.js
│   │   └── nodes/
│   │       ├── BuyerMatcher.js
│   │       ├── BuyerRanking.js
│   │       ├── ListingValidator.js
│   │       ├── PriceRecommendation.js
│   │       ├── RecommendationAgent.js
│   │       ├── SustainabilityAgent.js
│   │       └── WasteAnalysis.js
│   │
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/ReuseHub.git

cd ReuseHub
```

---

## 2. Install Backend Dependencies

```bash
cd backend

npm install
```

---

## 3. Install Frontend Dependencies

```bash
cd ../frontend

npm install
```

---

# 🔐 Environment Variables

## Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

FRONTEND_URL=http://localhost:5173
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

# ▶️ Running Locally

## Start Backend

```bash
cd backend

npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🌐 Production Deployment

## Frontend (Vercel)

https://reuse-hub-neon.vercel.app

---

## Backend (Render)

https://reusehub-nfqo.onrender.com

---

# 🚀 Deployment Steps

## Backend (Render)

Configure the following Environment Variables:

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

FRONTEND_URL=https://reuse-hub-neon.vercel.app
```

---

## Frontend (Vercel)

Configure:

```env
VITE_API_URL=https://reusehub-nfqo.onrender.com/api

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Google Cloud Console

### Authorized JavaScript Origins

```
http://localhost:5173

https://reuse-hub-neon.vercel.app
```

---

### Authorized Redirect URI

```
https://reusehub-nfqo.onrender.com/api/auth/google/callback
```

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/google` | Google Sign-In |
| GET | `/api/auth/profile` | Get Profile |
| PUT | `/api/auth/profile` | Update Profile |
| PUT | `/api/auth/change-password` | Change Password |

---

## Waste Listings

| Method | Endpoint |
|---------|----------|
| GET | `/api/listings` |
| POST | `/api/listings` |
| PUT | `/api/listings/:id` |
| DELETE | `/api/listings/:id` |

---

## Buyer Demands

| Method | Endpoint |
|---------|----------|
| GET | `/api/demands` |
| POST | `/api/demands` |
| PUT | `/api/demands/:id` |
| DELETE | `/api/demands/:id` |

---

## AI

| Method | Endpoint |
|---------|----------|
| POST | `/api/ai/analyze/:listingId` |
| GET | `/api/ai/recommendation/:listingId` |
| POST | `/api/ai/share-contact` |

---

## Analytics

| Method | Endpoint |
|---------|----------|
| GET | `/api/analytics` |
| GET | `/api/analytics/public` |

---

## Certificates

| Method | Endpoint |
|---------|----------|
| GET | `/api/certificates` |
| POST | `/api/certificates/generate` |

---

## Contact

| Method | Endpoint |
|---------|----------|
| POST | `/api/contact` |

# 🔐 Authentication & Authorization

ReuseHub implements secure authentication using **JWT (JSON Web Tokens)** along with **Google Sign-In**.

### Authentication Features

- Email & Password Login
- Google OAuth Login
- JWT-based Authentication
- Password Hashing using bcrypt
- Forgot Password via Email
- Change Password
- Protected Routes
- Role-based Access Control

---

# 👥 User Roles

## 🏭 Supplier

Suppliers can:

- Register/Login
- Create Waste Listings
- Edit/Delete Listings
- View AI Recommendations
- Match with Buyers
- Generate Sustainability Certificates
- View Dashboard Analytics

---

## 🛒 Buyer

Buyers can:

- Register/Login
- Browse Marketplace
- Create Material Demands
- Search Listings
- View AI Ranked Matches
- Contact Suppliers

---

## 👨‍💼 Admin

Administrators can:

- View Platform Statistics
- Monitor Listings
- Manage Users
- Access Admin Dashboard
- Analyze Marketplace Data

---

# 📊 Sustainability Metrics

ReuseHub automatically calculates environmental impact for every successful recycling transaction.

Metrics include:

- 🌱 Carbon Emissions Saved
- ♻️ Waste Recycled
- 🏭 Landfill Reduction
- 🌍 Sustainability Score
- 📈 Environmental Impact

---

# 🏆 Sustainability Certificates

After successful recycling, suppliers can generate professional certificates containing:

- Business Information
- Waste Details
- Carbon Savings
- Sustainability Score
- QR Code Verification
- Printable PDF Format

---

# 🤖 AI Workflow Summary

Every listing passes through the following pipeline:

```
Supplier Creates Listing
            │
            ▼
Listing Validator
            │
            ▼
Waste Analysis
            │
            ▼
Buyer Matching
            │
            ▼
Buyer Ranking
            │
            ▼
Price Recommendation
            │
            ▼
Sustainability Analysis
            │
            ▼
Final AI Recommendation
```

The AI workflow ensures accurate waste analysis, optimized pricing, sustainability insights, and intelligent buyer matching.

---

# 📈 Future Enhancements

Some planned improvements include:

- AI Chat Assistant
- Live Chat Between Buyers & Suppliers
- Real-time Notifications
- Payment Gateway Integration
- Waste Pickup Scheduling
- AI Demand Forecasting
- Mobile Application
- Barcode & QR Waste Tracking
- Carbon Credit Marketplace
- Multi-language Support

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📸 Screenshots

You can add screenshots here after uploading them to GitHub.

Example:

```
screenshots/

├── Home.png
├── Dashboard.png
├── Marketplace.png
├── Login.png
├── AI-Recommendation.png
├── Certificate.png
```

Then display them like:

```markdown
## Home

![Home](screenshots/Home.png)

## Dashboard

![Dashboard](screenshots/Dashboard.png)
```

---

# 📄 License

This project is licensed under the **ISC License**.

You are free to use, modify, and distribute this project in accordance with the license.

---

# 👩‍💻 Author

**Rishika Shah**

Integrated MSc IT Student

GLS University

---

# 🌍 Live Links

### Frontend

https://reuse-hub-neon.vercel.app

### Backend API

https://reusehub-nfqo.onrender.com

---

# 💚 About ReuseHub

ReuseHub is more than a marketplace—it's a step toward a cleaner and more sustainable future.

By combining **Artificial Intelligence**, **Circular Economy principles**, and **Smart Waste Management**, ReuseHub empowers businesses to transform waste into valuable resources while reducing environmental impact.

Together, we can build a greener tomorrow. 🌱

---

⭐ **If you found this project helpful, don't forget to star the repository!**
