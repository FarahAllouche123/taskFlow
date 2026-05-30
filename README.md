# TaskFlow — Task Management Application

A full-stack task management web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). TaskFlow allows users to create, organize, and track their tasks with an intuitive and modern interface.

---

## 📸 Screenshots

<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/eabc79fd-4a1a-48c4-9507-dfc11a9a2ef3" />
<img width="1908" height="913" alt="image" src="https://github.com/user-attachments/assets/379f1ba0-c76e-402b-8728-52149b532a20" />
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/7868fdc0-e567-485e-9c91-bcefbb279a3f" />
<img width="1911" height="910" alt="image" src="https://github.com/user-attachments/assets/954fcae1-95e0-48d0-bcd0-c26c1742237c" />

---

## 🎯 Overview

TaskFlow solves the problem of disorganized daily work by providing a clean, efficient platform to manage tasks. Users can set priorities, deadlines, and track progress in real time. An admin dashboard allows full oversight of all users and their data.

---

## ✨ Features

### 👤 User Features
- ✅ Secure registration and login
- ✅ Create, edit, delete tasks
- ✅ Set task title, description, deadline and priority (Low / Medium / High)
- ✅ Quick status change (To Do / In Progress / Completed)
- ✅ Search tasks by title (starts with)
- ✅ Filter by status and priority
- ✅ Sort by creation date, deadline or priority
- ✅ Real-time statistics (Total, In Progress, Completed, Overdue)
- ✅ Overdue task indicators
- ✅ Profile page (name, email, avatar, password)

### 🛡️ Admin Features
- ✅ Dedicated admin dashboard at `/admin`
- ✅ View all registered users
- ✅ View tasks of each user
- ✅ Delete users and all their data
- ✅ Global statistics (total users, total tasks)

### 🎨 UI Features
- ✅ Dark mode / Light mode toggle
- ✅ Toast notifications
- ✅ Responsive design
- ✅ CSS-in-JS styling with dynamic theming

---

## 🛠️ Tech Stack

### Backend
| Technology |
|------------|
| Node.js |
| Express.js |
| MongoDB |
| Mongoose |
| bcryptjs |
| jsonwebtoken |

### Frontend
| Technology |
|------------|
| React.js |
| React Router DOM |
| Axios |
| React Hot Toast |
| CSS-in-JS |

---

## 📁 Project Structure

```
taskflow/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Auth logic
│   │   ├── taskController.js      # Task CRUD logic
│   │   └── adminController.js     # Admin logic
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── adminMiddleware.js     # Admin access control
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Task.js                # Task schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth routes
│   │   ├── taskRoutes.js          # Task routes
│   │   └── adminRoutes.js         # Admin routes
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Entry point
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── bg.jpg
    └── src/
        ├── components/
        │   ├── auth/
        │   │   ├── AuthPage.jsx
        │   │   ├── PrivateRoute.jsx
        │   │   └── AdminRoute.jsx
        │   ├── layout/
        │   │   └── Navbar.jsx
        │   ├── tasks/
        │   │   ├── TaskCard.jsx
        │   │   ├── TaskModal.jsx
        │   │   ├── TaskFilters.jsx
        │   │   ├── StatsBar.jsx
        │   │   └── DeleteConfirmModal.jsx
        │   └── ui/
        │       └── index.jsx
        ├── context/
        │   ├── AuthContext.js
        │   └── ThemeContext.js
        ├── hooks/
        │   └── useTasks.js
        ├── pages/
        │   ├── Dashboard.js
        │   ├── ProfilePage.js
        │   └── AdminPage.js
        ├── utils/
        │   └── api.js
        ├── App.js
        ├── index.js
        └── index.css
```

---

## 🚀 Getting Started

### 1. Setup Backend
```bash
cd backend
npm install
cp .env .env
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env .env
npm start
```

### 3. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services start mongodb-community
```

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ADMIN_EMAIL=admin@taskflow.io
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_EMAIL=admin@taskflow.io
```

---

## 📡 API Endpoints

### Auth `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| GET | `/me` | Get current user |
| PUT | `/me` | Update profile |
| PUT | `/password` | Change password |

### Tasks `/api/tasks`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all tasks |
| POST | `/` | Create task |
| PUT | `/:id` | Update task |
| DELETE | `/:id` | Delete task |
| DELETE | `/completed/all` | Clear completed |

### Admin `/api/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Global statistics |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user + tasks |
| DELETE | `/users/:id` | Delete user |

---

## 👤 Admin Access

1. Register with the email defined in `ADMIN_EMAIL`
2. Login — redirected automatically to `/admin`
3. Navbar shows **ADMIN** badge and **🛡️ Admin** button

---

## 👩‍💻 Author

**Farah** 
