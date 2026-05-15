# StockTrail

A modern stock market tracking and analytics dashboard built with Vue.js. A production-style frontend project demonstrating component-driven architecture, state management, and responsive dashboard design.

## ✨ Features

- 📊 **Stock Discovery** - Browse and search market data
- 💼 **Portfolio Management** - Track holdings and order history
- 💰 **Wallet Management** - Manage balance and bank details
- 🔐 **User Authentication** - Secure login and registration with KYC support
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 📈 **Charts & Analytics** - Visual representation of market data
- 🎨 **Modern UI** - Clean, professional component-based interface

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation & Setup

**1. Install Backend Dependencies**
```bash
cd backend
npm install
```

**2. Install Frontend Dependencies**
```bash
cd frontend
npm install
```

**3. Set Environment Variables**
Create a `.env` file in the `backend` folder with required configurations.

**4. Start the Backend Server**
```bash
cd backend
npm start
# Server runs on http://localhost:5000 (or configured port)
```

**5. Start the Frontend Development Server** (in a new terminal)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

**6. Open in Browser**
Navigate to `http://localhost:5173` and you're all set!

---

## 🔐 Authentication Flow

```
User Opens App
    ↓
Auth Layout Shown (Login/Register/KYC)
    ↓
Successful Authentication
    ↓
Session Stored in Auth Store
    ↓
Route Guards Check Access
    ↓
Dashboard Layout Unlocked
    ↓
Main Application Accessible
```

**Key Points:**
- Authentication screens separated from main dashboard
- Route-based protection prevents unauthorized access
- Session state managed through centralized auth store
- KYC verification integrated into registration

---

## 📊 Application Flow

### User Journey
1. **Auth Phase**: User registers/logs in with credentials
2. **Dashboard Phase**: User views portfolio, holdings, and market overview
3. **Trading Phase**: User can buy/sell stocks from the market
4. **Wallet Phase**: User manages balance and bank accounts
5. **Profile Phase**: User views and edits personal information

### Data Flow
```
API Requests (httpClients.js)
    ↓
Store Actions (Pinia Stores)
    ↓
Vue Components (Reactive State)
    ↓
UI Updates
```

---

## 🎯 What to Explore in the Project

### 🏗️ **Architecture & Code Organization**
- **`frontend/src/components/`** - Learn how reusable UI components are structured
- **`frontend/src/stores/`** - Explore Pinia state management (authStore, walletStore, tradeStore, etc.)
- **`frontend/src/composables/`** - Discover reusable business logic and validation patterns
- **`frontend/src/router/`** - See how routes are organized and protected

### 🎨 **UI & Components**
- **`frontend/src/components/base/`** - Base components (Button, Input, Modal, Chart, etc.)
- **`frontend/src/components/dashboard/`** - Dashboard-specific widgets and cards
- **`frontend/src/layout/`** - AppLayout (authenticated) vs AuthLayout (login/register)
- **`frontend/style.css`** - Global styling with TailwindCSS configuration

### 🔄 **State Management**
- **`authStore.js`** - User session and login state
- **`walletStore.js`** - Wallet balance and banking operations
- **`tradeStore.js`** - Buy/sell operations and portfolio tracking
- **`marketStore.js`** - Stock and company data
- **`profileStore.js`** - User profile information

### 📡 **API Integration**
- **`frontend/src/api/httpClients.js`** - Centralized HTTP client configuration
- **`backend/src/routes/`** - API endpoints (auth, wallet, KYC, location)
- **`backend/src/controllers/`** - Route handlers and business logic

### ✅ **Validation & Forms**
- **`frontend/src/composables/*-schema-validator.js`** - Form validation schemas
- **`frontend/src/components/auth/register/`** - Multi-step registration flow
- **`frontend/src/components/profile/`** - Profile editing with validation

### 📁 **Project Structure**
```
frontend/src/
├── api/              → HTTP client setup
├── components/       → Reusable & feature components
├── composables/      → Business logic & validation
├── layout/           → App & Auth layouts
├── router/           → Route definitions
├── stores/           → Pinia state stores
├── views/            → Full page screens
└── style.css         → Global styles
```

---

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, Vite, Pinia, TailwindCSS, VeeValidate
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **UI Libraries**: Vue Sonner (notifications), Font Awesome (icons)

---

## 💡 Learning Value

This project demonstrates:
- ✓ Component-driven architecture and reusability
- ✓ Centralized state management patterns
- ✓ Route-based authentication and access control
- ✓ Responsive UI design with TailwindCSS
- ✓ API integration best practices
- ✓ Form validation and error handling
- ✓ Scalable folder structure for growing projects

---

## 📝 License

Built as an internship project for learning and demonstration purposes.

---

Happy trading! 🚀
