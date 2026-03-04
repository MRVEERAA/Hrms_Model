# 🏢 HRMS Model – Human Resource Management System

A full-stack Human Resource Management System (HRMS)
This application helps organizations manage employees, Teams, roles, and HR operations efficiently.

---

## 🚀 Tech Stack

**Frontend**

* React.js
* React Router
* Axios
* Tailwind

**Backend**

* Node.js
* Express.js
* Postgresql
* Supabase

**Other Tools**

* JWT Authentication
* bcrypt (Password Hashing)
* dotenv
* Postman (API Testing)

---

## 📌 Features

* 👤 Employee Registration & Login (JWT Authentication)
* 🔐 Role-based Authorization (Admin / HR / Employee)
* 🏢 Department Management
* 📋 Employee CRUD Operations
* 📊 Dashboard Overview
* 🔍 Search & Filter Employees
* 🔒 Secure Password Hashing
* 🗂 RESTful API Architecture

---

## 🧠 Project Architecture

This project follows a clean separation of concerns:

* **Frontend** handles UI and user interaction.
* **Backend API** handles business logic and data validation.
* **Database (Postgresql)** stores employee and department data securely.


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/hrms_model.git
cd hrms_model
```

### 2️⃣ Install Dependencies

Backend:

```bash
npm install
```

Frontend (if separate folder):

```bash
cd frontend
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root folder:

```
PORT=5000
Supabase_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application

Backend:

```bash
npm start
```

Frontend:

```bash
npm start
```

---

## 🔐 Authentication Flow

1. User registers / logs in.
2. Server validates credentials.
3. JWT token is generated.
4. Token is sent in headers for protected routes.
5. Middleware verifies token before granting access.

---

## 📈 Future Improvements

* Payroll Management
* Attendance Tracking
* Leave Management System
* Performance Analytics
* Deployment (Render / Vercel / AWS)

---

## 🧪 API Testing

All APIs were tested using Postman to ensure:

* Proper status codes
* Error handling
* Secure data validation

---

## 📌 Learning Outcome

Through this project, I strengthened my understanding of:

* REST API design
* Authentication & Authorization
* Database schema modeling
* Backend error handling
* Full-stack project structure

---

## 👨‍💻 Author

**VASANTHAKUMAR DURAIRAJ**
Full Stack Developer,
Passionate about building scalable web applications.

---

## ⭐ If You Like This Project

Give it a star ⭐ and feel free to fork or contribute.
