# AssetTrack - Full Stack Asset Management System

AssetTrack is a web-based application for managing, tracking, and reporting hardware assets within a software development team.

## Project Structure
- `/backend`: Spring Boot REST API (Java 17, PostgreSQL, Spring Security, JWT)
- `/frontend`: React SPA (Vite, React Router, Axios, Lucide Icons)

## Getting Started (IntelliJ IDEA)

### 1. Backend Setup
1. Open the `backend` folder in IntelliJ.
2. Wait for Maven to sync dependencies.
3. **Database**: The project is pre-configured with a cloud PostgreSQL (Neon). If you wish to use a local DB, update `src/main/resources/application.properties`.
4. Run the application via `src/main/java/com/assettrack/backend/BackendApplication.java`.
5. The API will be available at `http://localhost:8080`.

### 2. Frontend Setup
1. Open the `frontend` folder in IntelliJ or use the built-in terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the UI at `http://localhost:5173`.

## Authentication
- **Admin Access**: Sign up with an email containing "admin" or manually change the role in the database to `ADMIN`.
- **JWT**: The frontend handles JWT storage in `localStorage` and attaches it to all authenticated requests.

## Features (Person A)
- Full Authentication flow (Login/Signup).
- Protected routes based on User Roles.
- Admin Panel for user management.
- Real-time notification UI for asset alerts.
