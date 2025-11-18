# 🚀 Team-Sync : Project Manager – MERN Stack (Redux UI + MongoDB)

A full-stack Project & Task Management Web Application built using the MERN stack.
This application allows teams to create workspaces, manage tasks, track progress, assign responsibilities, and maintain project timelines—all stored securely in a MongoDB database.

## ⭐ Features
🏢 Workspace Management
  - Create a new workspace
  - Join workspace via invite code
  - View workspace analytics
  - Real-time workspace updates

## 📌 Task Management
  - Create tasks within a workspace
  - Assign tasks to members
  - Set task status (Todo / In-Progress / Completed)
  - Add deadlines & timelines
  - View all tasks in an organized UI

## 📊 Analytics Dashboard
  - Workspace-level stats
  - Task progress overview
  - Member contributions

## 👤 User Features
  - Authentication (Login / Register)
  - Join multiple workspaces
  - View assigned tasks

## 💾 Database
  - All tasks, workspace details, user details, timelines, and statuses are saved in MongoDB.

##  🛠️ Tech Stack
✔️ Frontend
  React.js
  Redux UI
  Redux Toolkit
  Axios
  Tailwind CSS / Custom UI components

✔️ Backend
  Node.js
  Express.js
  JWT Authentication
  REST API Architecture

✔️ Database
  MongoDB
  Mongoose ORM

## Project Structure

team-sync/
   ├── client/                # React frontend
   │   ├── src/
   │   ├── components/
   │   ├── pages/
   │   └── redux/
   ├── backend/                # Node + Express backend
   │   ├── models/
   │   ├── controllers/
   │   ├── routes/
   │   └── middleware/
   ├── teamsync-api/          # API test results 
   ├── README.md
   └── package.json
