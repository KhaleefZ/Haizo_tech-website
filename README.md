# HaizoTech Unified Operations System

This repository contains the complete ecosystem for HaizoTech, encompassing a public-facing agency website, an internal operations dashboard, and a centralized Node.js/PostgreSQL backend. This architecture ensures real-time synchronization and centralized management of data such as portfolio works, blog posts, and client inquiries.

## System Architecture

The repository is structured into three main applications:

1. **Public Frontend (`frontend`)**: The primary Next.js website for HaizoTech to showcase services, engineering insights (blogs), past work (portfolio), and collect client inquiries.
2. **Admin Dashboard (`admin-frontend`)**: A secure, "Glass-Functional" internal operations dashboard built with Next.js used by the HaizoTech team to manage projects, tasks, content, and clients.
3. **Unified Backend (`backend`)**: A centralized Express.js REST API with Prisma ORM and a PostgreSQL database that serves as the single source of truth for all applications.

## Technology Stack

- **Frontend (Public & Admin)**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Shadcn/UI, Zustand, React Query.
- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL, Prisma, JWT for Authentication.

## Key Features

- **Role-Based Access Control**: Secure internal dashboard with different access levels (`SUPER_ADMIN`, `MANAGER`, `DEV`).
- **Portfolio & Blog Management**: Admins can seamlessly create and update content from the dashboard, which instantly reflects on the public website.
- **Client Inquiries & CRM**: Contact forms submitted on the website are instantly pushed to the dashboard's inquiry manager.
- **Kanban Board**: Drag-and-drop project management interface for the internal team.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or via Docker)

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure your .env file with DATABASE_URL
   npx prisma migrate dev
   npm run seed # Populate DB with initial admin user
   npm run dev  # Starts Express server on port 5000
   ```

2. **Admin Dashboard Setup**
   ```bash
   cd admin-frontend
   npm install
   npm run dev  # Starts Next.js app on port 3000
   ```

3. **Public Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev  # Starts Next.js app on port 3001
   ```
