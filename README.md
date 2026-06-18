# 🍽️ Recipe Search App

A full-stack web application built with the **MERN** stack (MongoDB, Express, React, Node.js) that allows users to discover, search, and manage delicious recipes. It includes user authentication, role-based access control (Admin/User), and an intuitive, responsive UI.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![React](https://img.shields.io/badge/React-19.1-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg)
![Express.js](https://img.shields.io/badge/Express-5.1-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg)

---

## ✨ Features

### 🧑‍💻 User Features
- **Authentication System**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Recipe Discovery**: Browse a wide variety of recipes with high-quality images, ingredients, and step-by-step instructions.
- **Search & Filter**: Search for recipes by name, cuisine, or category.
- **Responsive Design**: Fully responsive interface built with Tailwind CSS, ensuring a great experience on mobile, tablet, and desktop.
- **Notifications**: Real-time feedback and toast notifications using `react-toastify`.

### 🛡️ Admin Features (Role-Based Access)
- **Admin Dashboard**: Dedicated dashboard for administrators to manage the platform's content.
- **Recipe Management**: Admins can create new recipes, upload images (handled via `multer`), edit, and delete existing recipes.
- **Category Management**: Create and assign dynamic categories to organize recipes effectively.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (v19)** with **Vite** for incredibly fast development and building.
- **Tailwind CSS (v4)** for modern, utility-first styling.
- **React Router DOM** for seamless, client-side routing.
- **Axios** for handling API requests.
- **Lucide React** for beautiful, consistent iconography.

### Backend
- **Node.js** & **Express.js** for building the RESTful API.
- **MongoDB** with **Mongoose** ORM for flexible data modeling.
- **JWT (jsonwebtoken)** for secure, stateless user authentication.
- **Multer** for handling multipart/form-data, primarily used for uploading recipe images.
- **Bcryptjs** for encrypting user passwords in the database.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mishalakbar205-dot/recipe-search-app.git
   cd recipe-search-app
   ```

2. **Install Frontend Dependencies**
   From the root directory, run:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   Navigate to the backend folder and install its dependencies:
   ```bash
   cd backend
   npm install
   ```

### Environment Variables

You need to set up your environment variables for both the frontend and backend.

1. **Backend**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

2. **Frontend**
   Create a `.env.development` (or just `.env`) file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   *(Check your codebase for the exact variable names used in your Axios config).*

### Running the Application

This project uses `concurrently` to run both the frontend and backend servers with a single command from the root directory.

1. Navigate to the root directory:
   ```bash
   cd recipe-search-app
   ```

2. Start the development servers:
   ```bash
   npm start
   ```
   * The backend server will typically start on `http://localhost:5000`
   * The frontend Vite server will start on `http://localhost:5173` (or similar).

---

## 📂 Project Structure

```text
recipe-search-app/
├── backend/                  # Node.js Express Backend
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Route controller logic (Recipes, Users, Categories)
│   ├── models/               # Mongoose schemas (User, Recipe, Category)
│   ├── routes/               # Express API routes
│   ├── middleware/           # Custom middleware (Auth, Upload)
│   ├── uploads/              # Directory for locally uploaded images
│   └── server.js             # Main backend entry point
├── public/                   # Static frontend assets
├── src/                      # React Frontend Source Code
│   ├── components/           # Reusable UI components
│   ├── pages/                # Main application pages
│   ├── context/              # React Context (Auth, Theme)
│   ├── config/               # Frontend configuration (Endpoints)
│   └── main.jsx              # React entry point
├── package.json              # Frontend/Root dependencies & scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── vite.config.js            # Vite bundler configuration
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open-source and available under the [ISC License](LICENSE).

