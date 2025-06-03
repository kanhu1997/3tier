# 3-Tier Application with Jenkins CI/CD

## Overview
This project demonstrates a 3-tier architecture:
- **Frontend:** React app (Dockerized)
- **Backend:** Node.js/Express API (Dockerized)
- **Database:** PostgreSQL (running on remote EC2, IP: 192.168.254.1333)
- **CI/CD:** Jenkins (Docker installed, runs both frontend and backend containers)

## Directory Structure
- `/frontend` - React app
- `/backend` - Node.js/Express API
- Jenkins pipeline scripts in project root

## Prerequisites
- Jenkins server with Docker installed
- Remote EC2 instance with PostgreSQL (IP: 192.168.254.1333)
- Network connectivity between Jenkins and DB server (ping test recommended)

## Setup Steps
1. **Clone this repository on Jenkins server**
2. **Build and run frontend/backend Docker containers**
3. **Configure backend to connect to remote PostgreSQL**
4. **Set up Jenkins pipeline for CI/CD**

## Detailed Instructions
See below for step-by-step setup for each component.

## Setup and Deployment

### 1. Prerequisites
- Jenkins server with Docker installed
- Remote EC2 instance with PostgreSQL (IP: 192.168.254.1333)
- Network connectivity between Jenkins and DB server (test with `ping 192.168.254.1333`)

### 2. Clone the Repository
```
git clone <your-repo-url>
cd 3tier
```

### 3. Configure Environment Variables
- Copy `.env.example` to `.env` in both `frontend` and `backend` folders and update values as needed.

### 4. Build and Run with Jenkins
- Ensure your Jenkins server can run Docker commands.
- Use the provided `Jenkinsfile` for pipeline setup.
- The pipeline will build Docker images and run containers for both frontend and backend.

### 5. Database Connectivity
- The backend connects to PostgreSQL at `192.168.254.1333` using environment variables.
- Ensure security groups/firewall allow traffic from Jenkins to the database server.

### 6. Accessing the Application
- Frontend: http://<jenkins-server-ip>/
- Backend API: http://<jenkins-server-ip>:5000/

---

## File Structure
- `frontend/` - React app (Dockerized)
- `backend/` - Node.js/Express API (Dockerized)
- `Jenkinsfile` - Jenkins pipeline script
- `.env.example` - Example environment files for both frontend and backend

---

## Notes
- Update database credentials in the backend `.env` file.
- For production, secure your environment variables and Docker images.
- For troubleshooting, check Jenkins logs and Docker container logs.

---

## Database Setup Instructions

### 1. Install PostgreSQL (if not already installed)
- On your EC2 instance, install PostgreSQL:
  - Amazon Linux: `sudo yum install postgresql-server`
  - Ubuntu: `sudo apt-get install postgresql`

### 2. Start PostgreSQL Service
- Amazon Linux: `sudo service postgresql start`
- Ubuntu: `sudo service postgresql start`

### 3. Set Up PostgreSQL User and Database
- Switch to the postgres user:
  ```sh
  sudo -i -u postgres
  psql
  ```
- Create a database user and database:
  ```sql
  CREATE USER your_db_user WITH PASSWORD 'your_db_password';
  CREATE DATABASE your_db_name OWNER your_db_user;
  GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_db_user;
  \q
  exit
  ```

### 4. Allow Remote Connections
- Edit `postgresql.conf` (location: `/var/lib/pgsql/data/` or `/etc/postgresql/<version>/main/`):
  - Set: `listen_addresses = '*'`
- Edit `pg_hba.conf` in the same directory:
  - Add: `host    all             all             0.0.0.0/0               md5`
- Restart PostgreSQL:
  - Amazon Linux: `sudo service postgresql restart`
  - Ubuntu: `sudo service postgresql restart`

### 5. Open Firewall/Security Group
- In AWS EC2 console, allow inbound TCP on port 5432 from your Jenkins server's IP.

### 6. Create the Users Table
- On your local machine or Jenkins server, connect to the EC2 database:
  ```sh
  psql -h 192.168.254.1333 -U your_db_user -d your_db_name
  ```
- Run the SQL from `backend/users.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
  );
  ```

### 7. Configure Backend Environment Variables
- In `backend/.env` (copy from `.env.example`):
  ```env
  DB_HOST=192.168.254.1333
  DB_USER=your_db_user
  DB_PASS=your_db_password
  DB_NAME=your_db_name
  ```

---

## Database Setup Instructions (Ubuntu 22.04 on VMware Workstation)

### 1. Install PostgreSQL
```sh
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 2. Start and Enable PostgreSQL Service
```sh
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Set Up PostgreSQL User and Database
```sh
sudo -i -u postgres
psql
```
In the psql prompt, run:
```sql
CREATE USER appserver WITH PASSWORD 'pass@123';
CREATE DATABASE appdb OWNER appserver;
GRANT ALL PRIVILEGES ON DATABASE appdb TO appserver;
\q
```
Exit the postgres user:
```sh
exit
```

### 4. Allow Remote Connections
- Edit `postgresql.conf` (usually at `/etc/postgresql/14/main/postgresql.conf`):
  - Find `listen_addresses` and set:
    ```
    listen_addresses = '*'
    ```
- Edit `pg_hba.conf` (usually at `/etc/postgresql/14/main/pg_hba.conf`):
  - Add this line at the end:
    ```
    host    all             all             0.0.0.0/0               md5
    ```
- Restart PostgreSQL:
```sh
sudo systemctl restart postgresql
```

### 5. Open Firewall (if enabled)
```sh
sudo ufw allow 5432/tcp
```

### 6. Create the Users Table
On your local machine or Jenkins server, connect to the Ubuntu VM:
```sh
psql -h <ubuntu-vm-ip> -U your_db_user -d your_db_name
```
Run the SQL from `backend/users.sql`:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);
```

### 7. Configure Backend Environment Variables
In `backend/.env` (copy from `.env.example`):
```
DB_HOST=<ubuntu-vm-ip>
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
```

---

Your PostgreSQL database is now ready for the application to connect and perform CRUD operations.

---

## Production Recommendations
- Set `NODE_ENV=production` and `REACT_APP_API_URL` to your Jenkins server's public address in production.
- Use strong, unique credentials for your PostgreSQL database.
- Use Docker secrets or a secure vault for sensitive environment variables.
- Regularly update dependencies and rebuild Docker images.
- Restrict network access to your database server to only trusted sources (e.g., Jenkins server IP).
- Use HTTPS and secure your Jenkins instance.

---
*This file will be updated with more details as the codebase is scaffolded.*
