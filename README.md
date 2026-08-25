# ProFootballDraft

A dynamic, full-stack fantasy football drafting application built with a modern React UI and a robust Java Spring Boot backend.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS (Glassmorphism & modern UI patterns)
- **Backend**: Java 21, Spring Boot 3, Spring Data JPA
- **Database**: PostgreSQL (containerized via Docker)
- **Tooling**: Maven, npm, Docker Compose

---

## Onboarding & Setup Instructions

Welcome to the team! To get this project running on your local machine, follow the instructions below based on your operating system.

### Prerequisites
Before running the scripts, ensure you have the following installed:
- **Node.js** (v18+)
- **Java JDK** (v21)
- **Docker & Docker Compose** (Must be running in the background)

### Mac & Linux Users

**1. Install Dependencies**
```bash
./scripts/install.sh
```

**2. Build the Application (Optional for Dev)**
```bash
./scripts/build.sh
```

**3. Start the Application**
```bash
./scripts/start.sh
```

### Windows Users
*We have provided `.bat` scripts so you can run the project natively using Command Prompt or PowerShell.*

**1. Install Dependencies**
```cmd
scripts\install.bat
```

**2. Build the Application (Optional for Dev)**
```cmd
scripts\build.bat
```

**3. Start the Application**
```cmd
scripts\start.bat
```

---

## Application URLs
Once the `start` script finishes booting, you can access the stack at:
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API API**: [http://localhost:8080](http://localhost:8080)
- **Database**: `localhost:5433` (Credentials in `application.yml`)
