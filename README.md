# BookNowGo - React Frontend Web Application

Modern, high-performance Hotel Booking & Reservation Platform built with **React 18**, **TypeScript**, and **Vite**, featuring **Neon Database Object Storage** for media uploads, unified **INR (`₹`) currency pricing**, a **Global Request Loader**, and restricted **Admin Portal authentication**.

---

## 🌟 Key Features

- **INR Currency Standardization (`₹`)**:
  - Full Indian Rupee (`en-IN`) formatting across customer search, hotel details, checkout, and owner dashboards.
  - Transparent fare engine calculating nightly rate × duration × rooms, 12% GST, 5% platform service fees, and coupon deductions.
- **Neon Database Object Storage**:
  - Direct & presigned image uploads directly to Neon Database Cloud Storage (`hotel-assets` bucket).
  - Permanent public download URLs generated and persisted for hotel covers, gallery photos, and room categories.
- **Dynamic Hotel & Room Management**:
  - Property owners can dynamically register properties, upload multi-image galleries, add room categories, configure bed layouts, capacity, and set nightly INR rates.
- **Global API Loader**:
  - Reactive top-edge gradient progress bar and floating glassmorphic status pill that automatically tracks all in-flight API requests and image uploads without blocking user interaction.
- **Secure Admin Authentication**:
  - Clean login portal strictly enforcing administrator access (`ROLE_ADMIN`). All demo credentials, auto-logins, and hardcoded test data have been removed.
- **Responsive & Modern UI**:
  - Polished design system built with vanilla CSS, interactive hotel photo switcher, responsive grid, modal controls, and mobile navigation.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 18 with TypeScript |
| **Build Tool & Bundler** | Vite 5 |
| **Cloud Media Storage** | Neon Database Object Storage (AWS S3-compatible) |
| **Icons** | Lucide React |
| **Routing** | React Router DOM v6 |
| **Styling** | Custom Vanilla CSS Design System with responsive variables |
| **Production Server** | Multi-stage Docker with Nginx SPA routing / Render Static Site |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (Node 20 recommended)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Backend API URL (leave blank for local Vite proxy to http://localhost:8080)
VITE_API_URL=

# Neon Database Storage Configuration
NEON_API_KEY=napi_your_neon_api_key_here
VITE_NEON_PROJECT_ID=your_neon_project_id
VITE_NEON_BRANCH_ID=your_neon_branch_id
VITE_NEON_BUCKET_NAME=hotel-assets
VITE_NEON_STORAGE_ENDPOINT=https://your-branch.storage.c-2.us-east-2.aws.neon.tech
```

> **Note**: `.env`, `.env.production`, and `.env.local` are protected by `.gitignore` to ensure credentials and API keys are never committed to Git.

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port assigned by Vite).

---

## 📁 Project Structure

```
booknowgo-frontend/
├── public/                  # Static assets
├── src/
│   ├── api/
│   │   ├── client.ts        # Core REST API client with auto-loading & auth headers
│   │   └── storage.ts       # Neon Database Storage upload & presign client
│   ├── components/
│   │   ├── admin/           # Admin modals and components (CouponModal, etc.)
│   │   ├── common/          # Global components (GlobalLoader, ImageUploader, Navbar, Footer)
│   │   ├── customer/        # Customer-facing components (HotelCard, RoomCard, HotelFilters, etc.)
│   │   └── owner/           # Property owner modals (CreateHotelModal, EditHotelModal, AddRoomModal, etc.)
│   ├── context/
│   │   ├── AuthContext.tsx     # Session management & role authorization
│   │   ├── CompareContext.tsx  # Multi-hotel side-by-side comparison
│   │   └── WishlistContext.tsx # Saved hotels wishlist state
│   ├── pages/               # Top-level route views (HomePage, SearchResults, HotelDetails, Owner, Admin, etc.)
│   ├── types/               # TypeScript data definitions & domain models
│   ├── utils/
│   │   ├── currency.ts      # Indian Rupee (INR) formatter & fare breakdown calculation
│   │   └── loadingManager.ts# Centralized reactive in-flight API request tracker
│   ├── App.tsx              # Root router & layout composition
│   ├── index.css            # Global CSS design tokens & animations
│   └── main.tsx             # React application entry point
├── Dockerfile               # Multi-stage production container build
├── nginx.conf               # Production Nginx reverse proxy & SPA routing
├── tsconfig.json            # Application TypeScript configuration
├── tsconfig.node.json       # Node environment TypeScript configuration
└── vite.config.ts           # Vite build config & Neon Storage middleware
```

---

## ☁️ Neon Database Storage Pipeline

Image assets for hotels and rooms are directly streamed to **Neon Database Object Storage**:

```
[Owner UI: ImageUploader]
          │
          ▼
POST /api/v1/storage/upload (multipart form data)
          │
          ▼
[Vite Dev Middleware / Cloud Backend]
  - Intercepts upload request using NEON_API_KEY
  - Calls Neon MCP presign tool
  - Streams image to Neon AWS S3 endpoint
          │
          ▼
Permanent Download URL:
https://<branch>.storage.<region>.aws.neon.tech/hotel-assets/<folder>/<timestamp>-<name>.jpg
          │
          ▼
Persisted into Hotel / Room entity
```

---

## 🚢 Deployment to Render

### Option 1: Deploy as a Static Site (Recommended)

1. Push this repository to your GitHub/GitLab account.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** > **Static Site**.
3. Connect your frontend repository.
4. Set the following build settings:
   - **Name**: `booknowgo-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. In **Environment Variables**, configure:

| Variable | Value / Description |
| :--- | :--- |
| `VITE_API_URL` | Your hosted backend URL (e.g. `https://booknowgo-backend.onrender.com`) |
| `NEON_API_KEY` | Your Neon Database API token (`napi_...`) |
| `VITE_NEON_PROJECT_ID` | Your Neon project ID |
| `VITE_NEON_BRANCH_ID` | Your Neon branch ID |
| `VITE_NEON_BUCKET_NAME` | `hotel-assets` |
| `VITE_NEON_STORAGE_ENDPOINT` | Your Neon S3 storage endpoint host |

6. Click **Create Static Site**.

---

### Option 2: Deploy as a Docker Web Service

1. In Render, select **New +** > **Web Service**.
2. Select your repository and choose **Docker** runtime.
3. The included [Dockerfile](file:///Users/sathish.s/Documents/booknowgo-frontend/Dockerfile) builds the Vite bundle and serves it via Alpine Nginx.
4. Set environment variable:
   - `BACKEND_URL`: `https://booknowgo-backend.onrender.com/api/`

---

## 🔒 Security Best Practices

- **Zero Hardcoded Secrets**: All Neon API keys, branch tokens, and endpoints are dynamically sourced via `loadEnv()` and `process.env`.
- **Admin-Only Access**: The `/login` route validates the `ROLE_ADMIN` authority upon token exchange. Non-admin users are denied access and logged out immediately.
- **Git Hygiene**: Environment files (`.env`, `.env.production`, `.env.local`) and TypeScript build caches (`*.tsbuildinfo`) are strictly ignored.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server with HMR |
| `npm run build` | Type-checks code with `tsc` and compiles optimized production assets to `dist/` |
| `npm run preview` | Locally serves the built production bundle in `dist/` |

---

## 📄 License
MIT License. Developed for BookNowGo Platform.
