# Cloud Security Monitoring System with Incident Management Assistance

A full-stack cloud security monitoring system developed using React, Spring Boot, PostgreSQL, JWT authentication, role-based access control, automated health monitoring, alert management, and email/SMS notifications.

## Project Overview

The Cloud Security Monitoring System is designed to monitor infrastructure assets and identify critical resource-usage conditions.

The system provides:

- Asset management
- Automated health monitoring
- CPU and memory threshold monitoring
- Alert generation and management
- Alert resolution workflow
- JWT-based authentication
- Role-based access control
- PostgreSQL database integration
- Asset search and status filtering
- Email notifications
- SMS notifications
- Dashboard monitoring
- Input validation
- Global exception handling

## Technology Stack

### Frontend

- React
- TypeScript
- JavaScript
- Vite
- Axios
- CSS

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- Maven
- Lombok

### Database

- PostgreSQL

### Notifications

- Spring Mail
- Twilio SMS

## System Architecture

```text
                 ┌──────────────────────┐
                 │      React UI        │
                 │   Frontend / Vite    │
                 └──────────┬───────────┘
                            │
                         REST API
                            │
                 ┌──────────▼───────────┐
                 │    Spring Boot       │
                 │       Backend        │
                 └──────────┬───────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
       ┌──────▼─────┐ ┌─────▼─────┐ ┌────▼────────┐
       │ PostgreSQL │ │   JWT &    │ │ Notification│
       │  Database  │ │   RBAC     │ │ Email / SMS │
       └────────────┘ └───────────┘ └─────────────┘
```

## Main Features

### 1. Asset Management

Administrators can:

- Add assets
- Edit assets
- Delete assets
- View asset details
- Search assets
- Filter assets by status

Asset information includes:

- Asset name
- Asset type
- IP address
- Location
- CPU usage
- Memory usage
- Disk usage
- Network usage

### 2. Automated Health Monitoring

The backend periodically checks asset health.

Current thresholds:

- CPU ≥ 90% → Critical condition
- Memory ≥ 80% → Warning condition

The monitoring system prevents repeated alerts while the same threshold condition remains active.

When the condition clears and later occurs again, a new alert can be generated.

### 3. Alert Management

The system supports:

- Alert creation
- Severity classification
- Open alerts
- Alert resolution
- Duplicate alert prevention
- Resolution timestamps

Supported alert severities include:

- LOW
- MEDIUM
- HIGH
- CRITICAL

### 4. Email and SMS Notifications

The system supports email and SMS notifications for alert events, including alert resolution.

HIGH and CRITICAL alerts generate email notifications, while SMS notifications are supported for alert events.

### 5. Authentication

The system uses JWT-based authentication with:

- Username/password login
- BCrypt password verification
- Access tokens
- Refresh tokens
- Token validation
- Expired-token handling
- Invalid-token handling
- Disabled-user protection

### 6. Role-Based Access Control

The application supports:

- **ADMIN** — administrative and asset-management operations
- **OPERATOR** — permitted operational and alert-management operations
- **VIEWER** — read-only monitoring and alert access

### 7. Validation and Exception Handling

The backend validates asset information including:

- Required fields
- IPv4 address format
- CPU usage range
- Memory usage range
- Disk usage range
- Network usage range

Centralized exception handling provides appropriate HTTP responses for unauthorized, forbidden, not-found, and invalid-input situations.

## Project Structure

```text
Cloud_Security_Monitoring/
│
├── README.md
│
├── cloud_security_monitoring_backend/
│   ├── database/
│   │   └── seed.sql
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
└── cloud_security_monitoring_frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── package-lock.json
    └── vite.config.ts
```

## Prerequisites

- Java 21
- Node.js and npm
- PostgreSQL
- Git

## Database Setup

1. Install and start PostgreSQL.
2. Create a database for the application.
3. Configure the database connection in:

```text
cloud_security_monitoring_backend/src/main/resources/application.properties
```

4. Configure the required database credentials.
5. The project contains `database/seed.sql` for initializing required data.

## Backend Configuration

Create the following file locally:

```text
cloud_security_monitoring_backend/src/main/resources/application.properties
```

Configure:

- PostgreSQL connection
- JWT secret
- Mail configuration
- Twilio configuration

**Do not commit passwords, API keys, application passwords, JWT secrets, or other credentials to GitHub.**

## Running the Backend

Open a terminal in:

```text
cloud_security_monitoring_backend
```

Run:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

## Running the Frontend

Open another terminal in:

```text
cloud_security_monitoring_frontend
```

Install dependencies:

```powershell
npm install
```

Start the application:

```powershell
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Alert Lifecycle

```text
High CPU / Memory
       │
       ▼
Health Monitor
       │
       ▼
Create Alert
       │
       ▼
Send Notification
       │
       ▼
Alert remains active
       │
       ▼
Resolve Alert
       │
       ├── Resolution Email
       └── Resolution SMS
       │
       ▼
Condition clears
       │
       ▼
Condition occurs again
       │
       ▼
New Alert
```

## Testing

The backend includes automated tests for:

- Asset service functionality
- JWT functionality
- Spring Boot application context

API functionality can also be tested using Postman.

## Security Features

- JWT authentication
- Refresh-token support
- BCrypt password hashing
- Role-based authorization
- Disabled-user protection
- Input validation
- Centralized exception handling
- Protected REST endpoints
- Duplicate alert prevention
- Credentials kept outside source control

## Future Enhancements

- Cloud-provider monitoring integration
- Real-time WebSocket monitoring
- Advanced incident management
- Vulnerability scanning
- Audit logging
- Compliance reporting
- Advanced analytics
- Docker deployment
- Cloud deployment
- More comprehensive automated testing

## Author

**Vinay Kumar**

Cloud Security Monitoring System with Incident Management Assistance