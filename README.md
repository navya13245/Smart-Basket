# 🛒 Smart Basket

Smart Basket is a modern, full-stack web application designed to revolutionize the in-store shopping experience. By leveraging QR/barcode scanning technology, users can scan items as they shop, manage a virtual cart in real-time, and checkout securely without waiting in traditional long lines.

## 🌟 Key Features

* **Smart Product Scanning**: Use your device's camera to scan product barcodes or QR codes to instantly add items to your cart.
* **Location-Based Store Selection**: Automatically find and select nearby Smart Basket locations using geolocation.
* **AI Shopping Assistant**: An integrated chatbot powered by Gemini 2.0 Flash to help users find products, suggest complementary items, and answer pricing questions.
* **Virtual Cart Management**: View, update quantities, and track your total spending in real-time.
* **Admin Dashboard**: A comprehensive management suite for store owners to add/delete products, generate downloadable product QR codes, and monitor customer orders.
* **Secure Authentication**: User sign-up and login powered by Firebase Auth.
* **Responsive Design**: A sleek, mobile-first UI built with React, Tailwind CSS, and Shadcn/UI.

## 🚀 Tech Stack

* **Frontend**: React 18 (TypeScript), Vite.
* **Styling**: Tailwind CSS, Framer Motion (animations), Shadcn/UI.
* **Backend/Database**: Firebase (Firestore, Authentication).
* **AI**: Google Gemini API (integrated via the Chatbot component).
* **State Management**: React Context API (Auth and Cart contexts), TanStack Query.
* **Utilities**: Lucide React (icons), Zod (schema validation), React Hook Form.

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18+)
* Firebase project credentials
* Gemini API Key

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd smartbasket

```


2. **Install dependencies**:
```bash
npm install

```


3. **Environment Variables (Frontend)**:
Create a `.env` file in the root directory and add your frontend credentials:
```env
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...", ...}
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_PAYMENT_CREATE_ORDER_URL=http://localhost:5000/api/payment/create-order
VITE_PAYMENT_VERIFY_URL=http://localhost:5000/api/payment/verify

```

4. **Environment Variables (Backend payment server)**:
Create a `.env.server` file in the root directory:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
PAYMENT_PORT=5000
CLIENT_ORIGIN=http://localhost:8080,http://localhost:8081,http://localhost:8082

```


5. **Run the development server**:
```bash
npm run dev

```

6. **Run payment backend (new terminal)**:
```bash
npm run dev:payment

```



## 📁 Project Structure

* `src/components`: Reusable UI elements (Shadcn) and layout components (Navbar, Footer).
* `src/context`: Global state management for Authentication and Shopping Cart.
* `src/pages`: Main application views including `Index`, `Scanner`, `Admin`, and `Cart`.
* `src/services`: Firebase configuration and modular API functions for products and orders.

## 🛡️ Admin Access

To access the Admin Dashboard (`/admin`), a user account must have the `isAdmin` flag set to `true` in the Firestore `users` collection. Admins can:

* Manage the product inventory.
* Generate and download QR codes for physical products.
* Review all customer order histories.

---

*Developed as a smart shopping solution to bridge the gap between physical and digital retail.*
