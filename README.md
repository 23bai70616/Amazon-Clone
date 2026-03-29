# 📦 Amazon Clone - Premium Full-Stack E-Commerce Experience

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> A high-fidelity, pixel-perfect recreation of the Amazon E-Commerce platform. This project demonstrates a deep understanding of full-stack development, modern UI/UX design principles, and scalable system architecture.

---

## ✨ Key Features

### 🛒 Shopping Experience
- **Dynamic Product Grid**: Responsive grid with categories, star ratings, and real-time availability.
- **Advanced Search & Filtering**: Instant search with optimized debounce and category-specific navigation.
- **Premium Carousel & Banners**: High-quality hero sections with smooth transitions.
- **Product Details**: Comprehensive detail views featuring high-resolution images, stock tracking, and user reviews.

### 🔐 User & Security
- **Secure Authentication**: JWT-based auth with encrypted password hashing (BCrypt).
- **Persistent Sessions**: Seamless user experience across reloads.
- **Personalized Wishlist**: Save items for later with a dedicated wishlist management system.

### 📦 Order Management
- **Smart Shopping Cart**: Real-time quantity management and stock validation.
- **Dynamic Checkout**: Multi-step checkout flow with real-time price calculations and shipping updates.
- **Order History & Tracking**: Detailed "Your Orders" page with order status tracking and cancellation flow.

### 📱 Responsive Design
- **Mobile-First Approach**: Fully optimized for phones, tablets, and desktops.
- **Glassmorphism UI**: Modern aesthetic with frosted glass effects and refined CSS transitions.

---

## 🛠️ Tech Stack

| Frontend | Backend | Database |
| :--- | :--- | :--- |
| **React 19** (Vite) | **Node.js** & **Express** | **PostgreSQL** |
| **React Router 7** | **JWT** & **BCrypt** | **ACID Transactions** |
| **Lucide Icons** | **Nodemailer** | **Relational Schemas** |
| **Vanilla CSS** (Zero UI Frameworks) | **CORS** & **Dotenv** | **Many-to-Many Junctions** |

---

## 📂 Project Architecture

```text
Amazon-Clone/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # State management (Cart, Wishlist, Auth)
│   │   ├── pages/        # Main application views
│   │   ├── utils/        # Helpers & formatters
│   │   └── services/     # API integration (Axios)
├── backend/              # Node.js/Express server
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── config/       # Database & env config
│   └── seed.js           # Automated database seeder
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### 1️⃣ Database Setup
1. Ensure **PostgreSQL** is running on your machine.
2. Create the project database:
   ```sql
   CREATE DATABASE amazon_clone;
   ```
3. Navigate to `backend/.env` and confirm your Postgres credentials (`PG_USER`, `PG_PASSWORD`).

### 2️⃣ Installation & Execution
Open two terminal windows to run the full-stack environment simultaneously:

**Backend Shell:**
```bash
cd backend
npm install
npm run seed     # Initializes PostgreSQL tables & mock data
npm run dev      # Server: http://localhost:5000
```

**Frontend Shell:**
```bash
cd frontend
npm install
npm run dev      # Client: http://localhost:5173
```

---

## 🧪 Quick Test-Drive (Reviewer Guide)
1. **Explore**: Navigate the homepage, click category pills, and search for items.
2. **Interact**: Add products to your **Cart** or **Wishlist** (Requires Login).
3. **Cart Logic**: Adjust quantities—notice real-time stock limits in action!
4. **Checkout**: Proceed to checkout, enter shipping info, and place an order.
5. **Orders**: Visit the "Your Orders" page to track status or cancel items.

---

## 👨‍💻 Developed By
**ADARSH KUMAR**  
*SDE Intern Applicant*  
[LinkedIn](https://www.linkedin.com/in/adarsh-kr-kumar/)
[GitHub](https://github.com/23bai70616)

---

## 🛡️ License
This project is for educational purposes as part of the SDE Intern assignment. All Amazon-related branding and trademarks belong to Amazon.com, Inc.

