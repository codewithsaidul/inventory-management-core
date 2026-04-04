# ⚙️ Inventory Management Core (Backend)

**Live Demo:** [https://inventory-management-web-rho.vercel.app](https://inventory-management-web-rho.vercel.app)

---

A robust, enterprise-grade RESTful API built with **Node.js, Express, and MongoDB**. This core engine handles the business logic, security, and data persistence for the Inventory Management System.

---

## 🚀 Features

### 🔑 Authentication & Authorization
- **JWT Based Auth:** Access and Refresh token implementation.
- **Role-Based Access Control (RBAC):** Strict permissions for `SUPERADMIN`, `ADMIN`, and `USER`.
- **Session Management:** Secure logout and token rotation logic.
- **Passport Integration:** Standardized authentication middleware.

### 📦 Core Business Logic
- **Inventory Management:** Full CRUD for products with automated slug generation and stock tracking.
- **Order Processing:** Transactional order creation with auto-generated Order IDs and stock validation.
- **Restock Intelligence:** Automated restock queue with priority calculation based on stock levels.
- **Activity Tracking:** Global logging system to track all administrative actions (Who, What, When).

### 🛠️ Technical Excellence
- **Query Builder:** Advanced searching, filtering, sorting, and pagination logic.
- **Global Error Handling:** Centralized handling for Zod, Mongoose, and App-specific errors.
- **Security:** Helmet, CORS, and request validation using Zod.
- **Database Seeding:** Automated `SUPERADMIN` seeding for initial setup.

---

## 🛠️ Tech Stack

| Layer          | Technology                          |
| :------------- | :---------------------------------- |
| **Runtime** | Node.js (Bun)                       |
| **Framework** | Express.js                          |
| **Language** | TypeScript                          |
| **Database** | MongoDB (Mongoose ODM)              |
| **Validation** | Zod                                 |
| **Auth** | JWT (JSON Web Token)                |

---

## 📂 Project Structure

The API follows a **Modular Architecture** where each domain contains its own controller, service, route, and interface:

```text
├── src/app/modules
│   ├── auth             # Authentication & Refresh Token logic
│   ├── user             # User profile & Status management
│   ├── products         # Inventory & Stock management
│   ├── categories       # Product grouping logic
│   ├── order            # Sales & Transactional logic
│   ├── restock          # Low-stock monitoring & restock actions
│   └── activitiTracking # Audit trails & Activity logging
├── src/app/middleware   # Auth guards, Validation & Error handlers
├── src/app/utils        # Reusable helpers (QueryBuilder, Token handlers)
└── src/server.ts        # Database connection & Server entry
```



## 🔗 API Endpoints (Quick View)

#### Auth & User
 - POST /api/v1/auth/login - User Login

 - POST /api/v1/auth/refresh-token - Get new access token

 - GET  /api/v1/users/me - Get logged-in user profile

#### Inventory & Management
 - GET    /api/v1/products - Get all products (with search/filter)

 - POST   /api/v1/products - Create new product (SuperAdmin)

 - PATCH  /api/v1/orders/:id/status - Update order lifecycle

 - GET    /api/v1/restock-queues - View items needing stock

 - GET    /api/v1/activitiLogs - View system-wide audit logs



## ⚡ Getting Started
### 1️⃣ Clone the Repository

``` bash

git clone [https://github.com/codewithsaidul/inventory-management-core](https://github.com/codewithsaidul/inventory-management-core)
cd inventory-management-core

```


### 2️⃣ Install Dependencies

```bash

bun install
```

### 3️⃣ Setup Environment Variables
Create a .env file in the root directory:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=your_mongodb_uri
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=365d

```


### 4️⃣ Run the Server

```bash
# Development mode
bun run dev

# Production build
bun run build
bun start

or

# Development mode
npm run dev

# Production build
npm run build
npm start
```


## 🛡️ Design Principles
 - DRY (Don't Repeat Yourself): Reusable catchAsync and sendResponse utilities.

 - Type Safety: 100% TypeScript coverage for interfaces and API responses.

 - Scalability: Module-based routing for easy feature expansion.

 - Security: Middleware-driven request validation and authentication.


## 🌐 Live URL
[Insert Live API Link Here]

## 👨‍💻 Author
#### Saidul Islam Rana MERN Stack Developer

## 📄 License
This project is licensed under the MIT License.