# HaizoTech Unified Operations System Requirements

This document outlines the core requirements, architecture, and technology stack for the HaizoTech Unified Operations System, which comprises the public-facing agency website, the internal operations dashboard, and the centralized Node.js/PostgreSQL backend.

**GitHub Repository:** [https://github.com/KhaleefZ/website.git](https://github.com/KhaleefZ/website.git)

## 1. System Overview

HaizoTech operates a multi-application ecosystem designed to serve both prospective clients and internal agency teams. 
The system ensures that data (such as portfolio works, blog posts, work categories, and client inquiries) is managed centrally and synced in real-time across the applications.

### 1.1 Applications
1. **Public Frontend (`frontend`)**: The primary website for HaizoTech to showcase services, engineering insights (blogs), past work (portfolio), and collect client inquiries.
2. **Admin Dashboard (`admin-frontend`)**: A secure, "Glass-Functional" internal operations dashboard used by the HaizoTech team to manage projects, tasks, content, categories, and clients.
3. **Unified Backend (`backend`)**: A centralized Express.js REST API and PostgreSQL database that serves as the single source of truth.

---

## 2. Technology Stack

### Frontend (Public & Admin)
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion (for animations)
- **Component Library**: Shadcn/UI, Lucide React (icons)
- **State Management**: Zustand (local state) & React Query / Fetch (server state)
- **Forms & Validation**: React Hook Form, Zod

### Backend
- **Framework**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Security**: JWT (JSON Web Tokens), bcryptjs (password hashing)

---

## 3. Core Modules & Features

### 3.1 Authentication & Security (RBAC)
- **Role-Based Access Control**:
  - `SUPER_ADMIN`: Full access to manage all content, users, and projects.
  - `MANAGER`: Can manage projects, kanban tasks, and content, but cannot delete core system records.
  - `DEV`: Restricted access. Primarily interacts with assigned Kanban tasks. Cannot edit or delete public-facing content (Works/Blogs).
- **Route Protection**: The Next.js `middleware.ts` forces unauthenticated users on the Admin Dashboard to a secure `/login` page.

### 3.2 Public Website Modules (`frontend`)
- **Portfolio (Works)**: Dynamically fetches published projects from the backend (`GET /api/works`) to showcase capabilities. Filterable by Categories.
- **Blog (Insights)**: Dynamically fetches technical articles and agency news (`GET /api/blogs`).
- **Contact Form**: Securely captures client inquiries and posts them directly to the backend (`POST /api/inquiries`), instantly making them available to the sales team in the Admin Dashboard.

### 3.3 Admin Dashboard Modules (`admin-frontend`)
- **Kanban Board**: The core project management view. Features drag-and-drop task columns (Backlog, In Progress, Review, Done).
- **Content Management (Blogs, Works, Categories)**: Data tables allowing Admins to Create, Read, Update, and Delete (CRUD) portfolio items, categories, and blog posts. Changes reflect instantly on the public website.
- **Inquiries Manager**: A CRM-style view for tracking new leads and contact requests submitted via the public website.
- **Project Tracking**: High-level tracking of client projects, associated tasks, and team velocity.

---

## 4. Database Architecture (PostgreSQL Schema)

The Prisma schema defines the following core models:
- **`User`**: Internal team members and their roles.
- **`Client`**: Organizations and contact persons.
- **`Project`**: High-level client deliverables.
- **`Column` & `Task`**: For the Kanban Board tracking.
- **`Work` & `WorkCategory`**: Portfolio items displayed on the public site and their respective categories.
- **`Blog`**: Content articles displayed on the public site.
- **`Inquiry`**: Form submissions from prospective clients.

---

## 5. Setup & Local Development

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or via Docker)
- Git

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/KhaleefZ/website.git
   cd website
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Ensure .env contains DATABASE_URL="postgresql://username:password@localhost:5432/haizotech"
   npx prisma migrate dev
   npm run seed # Populates DB with initial admin user and mock data
   npm run dev  # Starts Express server on port 5000
   ```

3. **Admin Dashboard Setup**
   ```bash
   cd admin-frontend
   npm install
   # Configure your .env.local file with the backend API URL
   npm run dev  # Starts Next.js app on port 3000
   ```

4. **Public Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Configure your .env.local file with the backend API URL
   npm run dev  # Starts Next.js app on port 3001
   ```

