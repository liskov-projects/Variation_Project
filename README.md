# Variation Project

A modern web application designed to simplify the creation, management, and tracking of construction variation forms for builders and clients.

[Live Variation Project](https://variation-front-end.onrender.com/)

## 📋 Overview

Variation forms are formal documents used to record and approve changes to the original scope of work outlined in a construction contract. They're essential for documenting amendments to agreements after they've been signed, ensuring all stakeholders are aware of the modifications.

This application digitizes the process, making it easier to create, submit, track, and maintain variation forms, thereby increasing efficiency and reducing administrative overhead in construction projects.

## 🚀 Key Features

- **User Authentication**: Secure login and registration with Clerk
- **Profile Management**: Complete builder profile setup with company and partnership information
- **Project Management**: Create and manage multiple construction projects
- **Variation Tracking**: Add, edit, and track the status of variations for each project
- **Dashboard**: Centralized view of all projects and their variations
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Problem Solved

Traditional variation form processes in construction involve:

- Manual paperwork that's time-consuming to create
- Difficult to track across projects
- Prone to errors and miscommunication
- Hard to maintain proper records
- Delays in approval processes

The Variation Project solves these issues by:

1. **Simplifying Creation**: Templates and digital forms make creation quick and easy
2. **Standardizing Format**: All forms follow industry-standard templates
3. **Centralizing Records**: All variations are stored in one accessible location
4. **Streamlining Approvals**: Electronic submission and approval reduce wait times
5. **Automatic Syncing**: When clients approve variations, they're automatically updated for builders
6. **Reducing Administrative Burden**: Less time spent on paperwork means more time for actual construction

## 💻 Tech Stack

### Frontend

- **React**: JavaScript library for building user interfaces
- **Context API**: For state management
- **Bootstrap 5**: For responsive UI components
- **React Router**: For navigation
- **Axios**: For API requests

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database (MongoDB Atlas cloud)
- **Mongoose**: MongoDB object modeling

### Authentication

- **Clerk**: For user authentication and management

## 🏗️ Project Structure

The application follows a modern architecture with:

- **Frontend**: React-based SPA with component-based architecture
- **Backend**: RESTful API built with Express
- **Database**: MongoDB collections for profiles, projects, and variations
- **Authentication**: Clerk integration for secure user management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB account (or local MongoDB)
- Clerk account (for authentication)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/variation-project.git
cd variation-project
```

2. Install dependencies for backend

```bash
cd back-end
npm install
```

3. Install dependencies for frontend

```bash
cd ../front-end
npm install
```

4. Set up environment variables

   - Create a `.env` file in the `back-end` directory with:

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5002
   ```

   - Create a `.env` file in the `front-end` directory with:

   ```
   REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   REACT_APP_API_URL=http://localhost:5002
   ```

5. Start the backend server

```bash
cd back-end
npm run dev
```

6. Start the frontend application

```bash
cd front-end
npm start
```

## 📱 Usage

1. **Sign Up/Sign In**: Create an account or sign in using Clerk authentication
2. **Profile Setup**: Complete your builder profile
3. **Dashboard**: View your projects and variations
4. **Create Project**: Add new construction projects
5. **Add Variations**: Create variation forms for specific projects
6. **Manage Variations**: Track, edit, and update variation statuses

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
