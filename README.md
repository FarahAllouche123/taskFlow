# TaskFlow — Task Management Application

A full-stack task management web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). TaskFlow allows users to create, organize, and track their tasks with an intuitive and modern interface.

![TaskFlow](https://img.shields.io/badge/Stack-MERN-green) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/eabc79fd-4a1a-48c4-9507-dfc11a9a2ef3" />
<img width="1908" height="913" alt="image" src="https://github.com/user-attachments/assets/379f1ba0-c76e-402b-8728-52149b532a20" />
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/7868fdc0-e567-485e-9c91-bcefbb279a3f" />
<img width="1911" height="910" alt="image" src="https://github.com/user-attachments/assets/954fcae1-95e0-48d0-bcd0-c26c1742237c" />



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
| jsonwebtoken | 9.0 | Authentication tokens |


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


