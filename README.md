# 🌱 Agriculture Portal

### A Digital Marketplace for Modern Agriculture

Agriculture Portal is a full-stack web application designed to bring agricultural products and customers together through a centralized digital marketplace. The platform aims to simplify agricultural shopping by providing product discovery, inventory management, shopping cart functionality, and order management.

---

## 📌 Project Overview

| Property | Details |
|---|---|
| Project Name | Agriculture Portal |
| Repository | Agriculture-Portal-Web |
| Project Type | Full-Stack Web Application |
| Domain | Agriculture / AgriTech / E-Commerce |
| Target Market | Indian Agriculture Market |
| Currency | Indian Rupee (₹) |
| Current Version | v1.0 |

## 🎯 Project Objectives

Agriculture Portal aims to make agricultural products more accessible through digital technology.

The platform focuses on:

- Connecting agricultural suppliers and customers.
- Simplifying agricultural product purchasing.
- Providing an organized product catalog.
- Improving inventory and order management.
- Offering a centralized administrative interface.
- Creating a foundation for future AgriTech integrations.

## ✨ Key Features

### 👨‍🌾 Customer Module
- User registration and login.
- Customer profile management.
- Browse agricultural products.
- Search and filter products.
- View product details and specifications.
- Add products to shopping cart.
- Manage cart quantities.
- Checkout and order placement.
- View order history and order status.

### 🛒 E-Commerce Module
- Dynamic product catalog.
- Product categories and specifications.
- Product pricing in Indian Rupees (₹).
- Product availability tracking.
- Shopping cart management.
- Order processing.

### 🛠️ Admin Module
- Administrative authentication.
- Admin dashboard.
- Add, update and delete products.
- Manage product categories.
- Manage inventory and stock.
- View and manage customer orders.
- Monitor order status.
- Business statistics and analytics.

> Note: Feature availability should be verified against the current implementation before describing every module as completed.

## 🧰 Technology Stack

Agriculture Portal is built using modern frontend and backend technologies, providing a modular architecture for application development.

### 🎨 Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | Component-based UI development |
| TypeScript | 5.6.3 | Static typing for frontend code |
| Vite | 5.4.11 | Development server and build tool |
| Tailwind CSS | 3.4.15 | Utility-first CSS styling |
| React Router DOM | 6.28.0 | Client-side routing |
| Framer Motion | 11.11.17 | UI animations |
| GSAP | 3.12.5 | Advanced animations |
| Three.js | 0.169.0 | 3D graphics |
| React Three Fiber | 8.17.10 | Three.js integration with React |
| React Three Drei | 9.117.0 | Helpers for 3D development |
| Lucide React | 0.468.0 | Icon library |
| PostCSS | 8.4.49 | CSS processing |
| npm | — | Package management |

### ⚙️ Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Backend programming language |
| Spring Boot | 3.3.4 | Backend application framework |
| Spring Web | 3.3.4 | REST API development |
| Spring Data JPA | 3.3.4 | Database persistence |
| Spring Security | 3.3.4 | Application security |
| Spring Validation | 3.3.4 | Input validation |
| PostgreSQL JDBC | Managed by Maven | Database connectivity |
| JJWT | 0.12.6 | JWT-related functionality |
| Spring Boot Actuator | 3.3.4 | Application monitoring |
| Apache Maven | 3.9.9 | Dependency and build management |

### 🛠️ Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- Apache Maven
- Windows Batch Script (`run.bat`)

---

## 🏗️ Application Architecture

Agriculture Portal follows a frontend-backend architecture with a separate database layer.

```text
             AGRICULTURE PORTAL
                     |
          +----------+----------+
          |                     |
       FRONTEND               BACKEND
          |                     |
        React               Java 21
      TypeScript           Spring Boot
        Vite               Spring Web
    Tailwind CSS          Spring Security
          |                Spring Data JPA
          |                     |
          +----------+----------+
                     |
                PostgreSQL
                     |
              Application Data
```

### Architecture Components

1. **Frontend Layer:** React and TypeScript handle the user interface and client-side application functionality.
2. **Backend Layer:** Spring Boot handles server-side application logic and REST API functionality.
3. **Security Layer:** Spring Security and JWT-related libraries provide the foundation for authentication and authorization.
4. **Persistence Layer:** Spring Data JPA manages database persistence.
5. **Database Layer:** PostgreSQL stores application information.

---

## 📁 Project Structure

```text
Agriculture-Portal-Web/
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       └── test/
│
├── README.md
└── run.bat
```

*Note: The internal source folder structure is abbreviated. Refer to the actual directories for complete details.*

---

## ⚙️ Installation & Setup

### Prerequisites

Install the following tools before running the application:

| Software | Required Version |
|---|---|
| Node.js | Compatible with Vite 5 |
| npm | Compatible with Node.js |
| Java JDK | 21 |
| Apache Maven | 3.9.9 |
| PostgreSQL | Installed and configured |
| Git | Latest stable version |

### 1. Clone the Repository

```bash
git clone https://github.com/NikhilRaval12/Agriculture-Portal-Web.git
```

### 2. Navigate to the Project

```bash
cd Agriculture-Portal-Web
```

### 3. Configure the Frontend

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

### 4. Configure the Backend

Open another terminal:

```bash
cd backend
```

Build the backend:

```bash
mvn clean package
```

Start the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 5. Database Configuration

Ensure PostgreSQL is running and configure the database connection according to the backend application configuration.

Before starting the backend:

- Configure the database URL.
- Set the database username and password.
- Verify the PostgreSQL connection.
- Configure any required environment variables.

**Important:** Never commit database passwords, JWT secrets, or other sensitive credentials to GitHub.

### 6. Run Both Applications

The repository includes a Windows batch script:

```text
run.bat
```

It is intended to start:

- Spring Boot Backend – Port 8080
- React + Vite Frontend – Port 5173

The current launcher uses machine-specific Windows paths. Update its paths before using it on another computer.

---

## 🗄️ Database

**Database Management System:** PostgreSQL

**Persistence Framework:** Spring Data JPA

The backend includes the PostgreSQL JDBC driver and JPA dependencies for database integration.

Database configuration and entity documentation will be maintained according to the actual backend implementation.

---

## 📦 Build & Development Commands

### Frontend Commands

| Command | Description |
|---|---|
| `npm install` | Install frontend dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build frontend |
| `npm run preview` | Preview production build |

### Backend Commands

| Command | Description |
|---|---|
| `mvn clean` | Clean previous build files |
| `mvn compile` | Compile backend source code |
| `mvn test` | Run backend tests |
| `mvn package` | Package the application |
| `mvn spring-boot:run` | Start Spring Boot application |

---

## 📌 Version History

| Version | Description | Status |
|---|---|---|
| v1.0 | Initial Agriculture Portal release | Released |

For updates, bug fixes, and feature additions, visit the [GitHub Releases](https://github.com/NikhilRaval12/Agriculture-Portal-Web/releases) page.

Agriculture Portal is built using modern frontend and backend technologies, providing a modular architecture for application development.

### 🎨 Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | Component-based UI development |
| TypeScript | 5.6.3 | Static typing for frontend code |
| Vite | 5.4.11 | Development server and build tool |
| Tailwind CSS | 3.4.15 | Utility-first CSS styling |
| React Router DOM | 6.28.0 | Client-side routing |
| Framer Motion | 11.11.17 | UI animations |
| GSAP | 3.12.5 | Advanced animations |
| Three.js | 0.169.0 | 3D graphics |
| React Three Fiber | 8.17.10 | Three.js integration with React |
| React Three Drei | 9.117.0 | Helpers for 3D development |
| Lucide React | 0.468.0 | Icon library |
| PostCSS | 8.4.49 | CSS processing |
| npm | — | Package management |

### ⚙️ Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Backend programming language |
| Spring Boot | 3.3.4 | Backend application framework |
| Spring Web | 3.3.4 | REST API development |
| Spring Data JPA | 3.3.4 | Database persistence |
| Spring Security | 3.3.4 | Application security |
| Spring Validation | 3.3.4 | Input validation |
| PostgreSQL JDBC | Managed by Maven | Database connectivity |
| JJWT | 0.12.6 | JWT-related functionality |
| Spring Boot Actuator | 3.3.4 | Application monitoring |
| Apache Maven | 3.9.9 | Dependency and build management |

### 🛠️ Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- Apache Maven
- Windows Batch Script (`run.bat`)

---

## 🏗️ Application Architecture

Agriculture Portal follows a frontend-backend architecture with a separate database layer.

```text
             AGRICULTURE PORTAL
                     |
          +----------+----------+
          |                     |
       FRONTEND               BACKEND
          |                     |
        React               Java 21
      TypeScript           Spring Boot
        Vite               Spring Web
    Tailwind CSS          Spring Security
          |                Spring Data JPA
          |                     |
          +----------+----------+
                     |
                PostgreSQL
                     |
              Application Data
```

### Architecture Components

1. **Frontend Layer:** React and TypeScript handle the user interface and client-side application functionality.
2. **Backend Layer:** Spring Boot handles server-side application logic and REST API functionality.
3. **Security Layer:** Spring Security and JWT-related libraries provide the foundation for authentication and authorization.
4. **Persistence Layer:** Spring Data JPA manages database persistence.
5. **Database Layer:** PostgreSQL stores application information.

---

## 📁 Project Structure

```text
Agriculture-Portal-Web/
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       └── test/
│
├── README.md
└── run.bat
```

*Note: The internal source folder structure is abbreviated. Refer to the actual directories for complete details.*

---

## ⚙️ Installation & Setup

### Prerequisites

Install the following tools before running the application:

| Software | Required Version |
|---|---|
| Node.js | Compatible with Vite 5 |
| npm | Compatible with Node.js |
| Java JDK | 21 |
| Apache Maven | 3.9.9 |
| PostgreSQL | Installed and configured |
| Git | Latest stable version |

### 1. Clone the Repository

```bash
git clone https://github.com/NikhilRaval12/Agriculture-Portal-Web.git
```

### 2. Navigate to the Project

```bash
cd Agriculture-Portal-Web
```

### 3. Configure the Frontend

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

### 4. Configure the Backend

Open another terminal:

```bash
cd backend
```

Build the backend:

```bash
mvn clean package
```

Start the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 5. Database Configuration

Ensure PostgreSQL is running and configure the database connection according to the backend application configuration.

Before starting the backend:

- Configure the database URL.
- Set the database username and password.
- Verify the PostgreSQL connection.
- Configure any required environment variables.

**Important:** Never commit database passwords, JWT secrets, or other sensitive credentials to GitHub.

### 6. Run Both Applications

The repository includes a Windows batch script:

```text
run.bat
```

It is intended to start:

- Spring Boot Backend – Port 8080
- React + Vite Frontend – Port 5173

The current launcher uses machine-specific Windows paths. Update its paths before using it on another computer.

---

## 🗄️ Database

**Database Management System:** PostgreSQL

**Persistence Framework:** Spring Data JPA

The backend includes the PostgreSQL JDBC driver and JPA dependencies for database integration.

Database configuration and entity documentation will be maintained according to the actual backend implementation.

---

## 📦 Build & Development Commands

### Frontend Commands

| Command | Description |
|---|---|
| `npm install` | Install frontend dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build frontend |
| `npm run preview` | Preview production build |

### Backend Commands

| Command | Description |
|---|---|
| `mvn clean` | Clean previous build files |
| `mvn compile` | Compile backend source code |
| `mvn test` | Run backend tests |
| `mvn package` | Package the application |
| `mvn spring-boot:run` | Start Spring Boot application |

---

## 📌 Version History

| Version | Description | Status |
|---|---|---|
| v1.0 | Initial Agriculture Portal release | Released |

For updates, bug fixes, and feature additions, visit the [GitHub Releases](https://github.com/NikhilRaval12/Agriculture-Portal-Web/releases) page.

## 🏗️ Application Architecture

The application is organized into separate frontend, backend and database layers.

```text
              AGRICULTURE PORTAL
                      |
          +-----------+-----------+
          |                       |
       FRONTEND                 BACKEND
          |                       |
    +-----+------+          +-----+------+
    |     |      |          |     |      |
   Home Products Cart      Auth Products Orders
    |     |      |          |     |      |
    +-----+------+          +-----+------+
                                  |
                             DATABASE
                                  |
                   +--------------+--------------+
                   |              |              |
                 Users         Products         Orders
                   |              |              |
                Customers     Inventory       Order Items
```

### Architecture Layers

1. **Frontend Layer:** Handles the user interface, product browsing, shopping cart and administrative interface.
2. **Backend Layer:** Handles application logic, authentication, product operations and order processing.
3. **Database Layer:** Stores application data, including users, products, inventory and orders.
4. **Admin Layer:** Provides administrative management capabilities.

## 📁 Project Structure

```text
Agriculture-Portal-Web/
│
├── backend/
│
├── frontend/
│
├── README.md
│
└── run.bat
```

The internal folder structure is maintained separately within the frontend and backend directories.

## ⚙️ Installation & Setup

### Prerequisites

- Git
- Required runtime for the frontend
- Required runtime for the backend
- Database server used by the application
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/NikhilRaval12/Agriculture-Portal-Web.git
```

### 2. Navigate to the Project

```bash
cd Agriculture-Portal-Web
```

### 3. Configure the Application

- Open the project in Visual Studio Code.
- Configure frontend dependencies.
- Configure backend dependencies.
- Set up the required database.
- Configure environment variables and application credentials.

### 4. Run the Application

Use the appropriate startup commands or the provided `run.bat` script according to the current project configuration.

> Refer to the frontend and backend configuration files for the exact installation and execution commands.

## 🗄️ Database Design

The application is designed around the following main data entities:

| Entity | Purpose |
|---|---|
| Users | Customer and administrator information |
| Products | Agricultural product information |
| Categories | Product classification |
| Inventory | Stock and availability |
| Cart | Shopping cart information |
| Orders | Customer order information |
| Order Items | Products included in orders |
| Payments | Payment transaction information |

## 📸 Application Screenshots

Screenshots can be added here to demonstrate the application's actual interface.

Recommended screenshots:

- Home Page
- Product Listing
- Product Details
- Shopping Cart
- Checkout Page
- Admin Dashboard

Store screenshots inside a `screenshots/` directory and embed the actual image paths here.

## 🚀 Future Enhancements

The following features are potential future improvements:

- Online payment integration (UPI, cards and other payment methods).
- Multilingual support (Gujarati, Hindi and English).
- AI-based agricultural product recommendations.
- Smart inventory management.
- Order and delivery tracking.
- Dedicated farmer dashboard.
- Product reviews and ratings.
- Weather information and alerts.
- Android and iOS application.
- Advanced business analytics.

## 📌 Version History

| Version | Release | Description |
|---|---|---|
| v1.0 | Initial Release | Initial Agriculture Portal project release |

Future versions will be added here when their corresponding GitHub releases are published.

For detailed changes, visit the [GitHub Releases](https://github.com/NikhilRaval12/Agriculture-Portal-Web/releases) page.

## 🤝 Contributing

Contributions, suggestions and improvements are welcome.

To contribute:

1. Fork this repository.
2. Create a feature branch.
3. Implement your changes.
4. Commit your changes with meaningful commit messages.
5. Push your branch.
6. Submit a Pull Request.

## 👨‍💻 Developer

**Nikhil Raval**

- GitHub: https://github.com/NikhilRaval12
- LinkedIn: https://www.linkedin.com/in/nikhil-raval-259420420/

## 📄 License

License information will be added when the project license is selected.

---

<div align="center">

### 🌾 Empowering Indian Agriculture Through Digital Innovation

**Agriculture Portal – Connecting Agriculture with Technology.**

Developed with ❤️

</div>