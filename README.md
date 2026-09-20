# Cloud Security Monitoring System with Incident Management Assistance

A full-stack cloud security monitoring system developed using React, Spring Boot, PostgreSQL, JWT authentication, role-based access control, automated health monitoring, alert management, and email/SMS notifications.

The project was initially developed and tested in a local development environment and was subsequently deployed to AWS for the final implementation and demonstration.

---

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
- AWS cloud deployment

---

## Technology Stack

### Frontend

- React
- TypeScript
- JavaScript
- Vite
- Axios
- CSS

### Backend

- Java 21
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

### Cloud and Deployment

- AWS EC2
- AWS RDS PostgreSQL
- AWS CloudWatch
- Docker
- Docker Hub
- AWS Security Groups

---

# System Architecture

## Final AWS Architecture

```text
                         ┌──────────────────────┐
                         │        User          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │      Vite / UI       │
                         └──────────┬───────────┘
                                    │
                              REST API / JWT
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       AWS EC2        │
                         │                      │
                         │   Docker Container   │
                         │          │           │
                         │          ▼           │
                         │   Spring Boot API    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       AWS RDS        │
                         │      PostgreSQL      │
                         └──────────────────────┘

                         AWS CloudWatch
                               │
                               ▼
                     EC2 Infrastructure Metrics
```

The final backend is deployed on AWS EC2 and runs inside a Docker container.

PostgreSQL is hosted on AWS RDS, while AWS CloudWatch is used for EC2 infrastructure monitoring.

---

# Development Journey

The project was developed in two stages.

## Stage 1 — Local Development

The application was initially developed and tested in a local environment.

```text
React / Vite
      │
      ▼
Spring Boot
      │
      ▼
Local PostgreSQL
```

Local development was used to implement and test the core application features, including authentication, asset management, monitoring, alerts, and notifications.

## Stage 2 — AWS Deployment

After the core application was developed and tested locally, the system was deployed to AWS for the final implementation and demonstration.

```text
React Frontend
      │
      ▼
AWS EC2
      │
      ▼
Docker Container
      │
      ▼
Spring Boot Backend
      │
      ▼
AWS RDS PostgreSQL
```

AWS CloudWatch is used to monitor the EC2 infrastructure.

---

# Main Features

## 1. Asset Management

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

---

## 2. Automated Health Monitoring

The backend periodically checks asset health using a scheduled monitoring process.

The monitoring process runs every 60 seconds.

### Current Thresholds

```text
CPU ≥ 90%       → Critical condition
Memory ≥ 80%    → Medium/Warning condition
```

The system prevents repeated alerts while the same threshold condition remains active.

When the condition clears and later occurs again, a new alert can be generated.

The current health-monitoring implementation evaluates the stored CPU and memory values.

---

## 3. Alert Management

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

---

## 4. Email and SMS Notifications

The system supports email and SMS notifications for configured alert events.

### Email

Email notification support is implemented using Spring Mail.

HIGH and CRITICAL alert events can generate email notifications.

### SMS

SMS notification support is implemented using Twilio.

The backend can send SMS notifications for configured alert events.

---

# Authentication

The application uses JWT-based authentication with:

- Username/password login
- BCrypt password verification
- Access tokens
- Refresh tokens
- Token validation
- Expired-token handling
- Invalid-token handling
- Disabled-user protection

### Token Configuration

```text
Access Token  → 15 minutes
Refresh Token → 7 days
```

Protected REST APIs require a valid access token.

---

# Role-Based Access Control

The application supports different user roles.

## ADMIN

Administrative users can:

- Manage assets
- View monitoring information
- Manage alerts
- Perform administrative operations

## OPERATOR

Operational users can:

- Perform permitted operational activities
- Manage alerts according to assigned permissions

## VIEWER

Viewer users have read-only access to monitoring information and alerts.

The backend enforces role permissions so authorization is not dependent only on frontend UI restrictions.

---

# Current System Workflow

```text
User
 │
 ▼
React Frontend
 │
 ▼
JWT Login
 │
 ▼
Spring Boot Backend on AWS EC2
 │
 ├──────────────► Authentication / RBAC
 │
 ▼
AWS RDS PostgreSQL
 │
 ▼
Asset and Alert Data
 │
 ▼
Scheduled Health Monitor
 │
 ├── CPU Threshold Check
 │
 └── Memory Threshold Check
 │
 ▼
Alert Generation
 │
 ├── Duplicate Alert Prevention
 │
 └── Notification Services
 │       ├── Email
 │       └── SMS
 │
 ▼
Dashboard / Alert Management
```

---

# Alert Lifecycle

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
Condition Clears
       │
       ▼
Condition Occurs Again
       │
       ▼
New Alert
```

---

# AWS Deployment

The final implementation is deployed on Amazon Web Services.

## AWS EC2

AWS EC2 hosts the Spring Boot backend.

The backend runs inside a Docker container on the EC2 instance.

```text
AWS EC2
   │
   └── Docker
         │
         └── Spring Boot Backend
```

---

## Docker Deployment

The Spring Boot backend is containerized using Docker.

The deployment workflow is:

```text
Spring Boot Source
       │
       ▼
Maven Build
       │
       ▼
JAR File
       │
       ▼
Docker Image
       │
       ▼
Docker Hub
       │
       ▼
AWS EC2
       │
       ▼
Running Backend Container
```

Docker Hub is used to store the backend Docker image.

---

## AWS RDS PostgreSQL

PostgreSQL is hosted using Amazon RDS.

The Spring Boot backend running on EC2 connects to the RDS PostgreSQL database.

```text
AWS EC2
   │
   │ PostgreSQL Connection
   ▼
AWS RDS
   │
   ▼
PostgreSQL Database
```

The database stores application information including:

- Users
- Roles
- Assets
- Alerts
- Monitoring data

---

## AWS Security Groups

AWS Security Groups are used to control network access to the EC2 instance and RDS database.

The deployment allows the required communication between the EC2 backend and the RDS PostgreSQL database.

---

## AWS CloudWatch

AWS CloudWatch is used for infrastructure-level monitoring of the EC2 instance.

The EC2 instance can be monitored using metrics such as:

- CPU utilization
- Network activity

CloudWatch provides visibility into the AWS infrastructure hosting the application.

---

# AWS Deployment Workflow

```text
1. Develop and test application locally
              │
              ▼
2. Build Spring Boot JAR
              │
              ▼
3. Create Docker image
              │
              ▼
4. Push Docker image to Docker Hub
              │
              ▼
5. Pull Docker image on AWS EC2
              │
              ▼
6. Run backend Docker container
              │
              ▼
7. Configure AWS RDS PostgreSQL
              │
              ▼
8. Connect EC2 backend to RDS
              │
              ▼
9. Configure frontend API endpoint
              │
              ▼
10. Run final application on AWS
              │
              ▼
11. Monitor EC2 using CloudWatch
```

---

# Project Structure

```text
Cloud_Security_Monitoring/
│
├── README.md
│
├── Project_Documentation/
│   └── cloud_security_monitoring.pptx
│
├── cloud_security_monitoring_backend/
│   ├── database/
│   │   └── seed.sql
│   │
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │
│   │   └── test/
│   │
│   ├── Dockerfile
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
    │
    ├── package.json
    ├── package-lock.json
    └── vite.config.ts
```

---

# Prerequisites

For local development:

- Java 21
- Node.js
- npm
- PostgreSQL
- Git
- Maven

For AWS deployment:

- AWS account
- EC2 instance
- RDS PostgreSQL database
- Docker
- Docker Hub account
- Appropriate AWS Security Group configuration

---

# Local Development Setup

The application was initially developed and tested locally before deployment to AWS.

## Local Database Setup

1. Install and start PostgreSQL.
2. Create a database for the application.
3. Configure the database connection in:

```text
cloud_security_monitoring_backend/src/main/resources/application.properties
```

4. Configure the required database credentials.
5. The project contains:

```text
database/seed.sql
```

for initializing required data.

---

# Local Backend Execution

Open a terminal in:

```text
cloud_security_monitoring_backend
```

Run:

```powershell
.\mvnw.cmd spring-boot:run
```

Local backend:

```text
http://localhost:8080
```

---

# Local Frontend Execution

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

Local frontend:

```text
http://localhost:5173
```

The local setup is intended for development and testing. The final deployment uses AWS infrastructure.

---

# Backend Configuration

Create the following file locally:

```text
cloud_security_monitoring_backend/src/main/resources/application.properties
```

Configure:

- PostgreSQL connection
- JWT secret
- Mail configuration
- Twilio configuration

For the AWS deployment, the backend is configured to connect to the AWS RDS PostgreSQL database.

---

# Security Configuration

Sensitive configuration values must not be committed to source control.

Do not commit:

- Database passwords
- API keys
- Twilio credentials
- Mail passwords
- JWT secrets
- Application passwords
- `.env` files
- `.pem` private keys
- Other authentication credentials

The project keeps sensitive configuration outside source control.

---

# Validation and Exception Handling

The backend validates asset information including:

- Required fields
- IPv4 address format
- CPU usage range
- Memory usage range
- Disk usage range
- Network usage range

Centralized exception handling provides appropriate HTTP responses for:

- Unauthorized requests
- Forbidden requests
- Not-found resources
- Invalid input

---

# Testing

The backend includes automated tests for:

- Asset service functionality
- JWT functionality
- Spring Boot application context

API functionality can also be tested using Postman.

The AWS deployment can additionally be verified through:

- EC2 instance status
- Docker container status
- Spring Boot application logs
- AWS RDS database connectivity
- Protected REST API responses
- AWS CloudWatch metrics

---

# Security Features

- JWT authentication
- Access and refresh token support
- BCrypt password hashing
- Role-based authorization
- Disabled-user protection
- Input validation
- Centralized exception handling
- Protected REST endpoints
- Duplicate alert prevention
- Parameterized database operations through Spring Data JPA
- Credentials kept outside source control
- AWS Security Groups for controlled network access

---

# Deployment Environment

## Initial Development Environment

```text
React / Vite
      │
      ▼
Spring Boot
      │
      ▼
PostgreSQL
```

The initial environment was used for development and testing.

## Final AWS Environment

```text
React Frontend
      │
      ▼
AWS EC2
      │
      └── Docker
            │
            └── Spring Boot Backend
                    │
                    ▼
              AWS RDS PostgreSQL

AWS CloudWatch
      │
      └── EC2 Infrastructure Monitoring
```

---

# Future Enhancements

Possible future enhancements include:

- Direct cloud-provider monitoring integration with application logic
- Advanced real-time monitoring
- Advanced incident management
- Vulnerability scanning
- Audit logging
- Compliance reporting
- Advanced analytics
- More comprehensive automated testing
- Additional cloud infrastructure integrations

---

# Team

- Vinay Kumar
- Deepali Singh
- Hrishta Dey
- Lav Saxena
- NIVETHA V.
- Rakesh Dintakurthi

---

# Project

**Cloud Security Monitoring System with Incident Management Assistance**

Developed as part of the **Infosys Springboard Internship 2026**.