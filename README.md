# Employee Management System (EMS)

A full-stack Employee Management System built with React.js, Node.js, Express.js, and MySQL.

## Features

- **Authentication**: JWT-based login/logout with password hashing (bcrypt)
- **Role-Based Access**: Admin-only access for all operations
- **Employee CRUD**: Add, View, Edit, and Delete employees
- **Dashboard**: Stats overview with total employees, average salary, department count
- **Search & Filter**: Search by name/phone, filter by department
- **Sorting**: Sort employees by name, salary, or department
- **Pagination**: Paginated employee list with navigation
- **Responsive Design**: Works on desktop and mobile devices
- **Form Validation**: Client-side and server-side validation
- **Modern UI**: Clean, modern dashboard with Bootstrap 5

## Tech Stack

### Frontend
- React.js 18
- React Router DOM 6
- Axios
- Bootstrap 5
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- dotenv

## Project Structure

```
EMS/
├── backend/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── employeeController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT middleware
│   │   └── validation.js     # Validation middleware
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   ├── employees.js      # Employee routes
│   │   └── validation.js    # Validation rules
│   ├── models/
│   ├── .env                  # Environment variables
│   ├── database.sql          # Database schema
│   ├── package.json
│   └── server.js             # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js
    │   │   ├── Loading.js
    │   │   ├── ProtectedRoute.js
    │   │   ├── Sidebar.js
    │   │   └── Toast.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── AddEmployee.js
    │   │   ├── Dashboard.js
    │   │   ├── EditEmployee.js
    │   │   ├── Login.js
    │   │   └── ViewEmployees.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Step 1: Database Setup

1. Open MySQL command line or MySQL Workbench
2. Create the database and tables:

```bash
mysql -u root -p < backend/database.sql
```

Or run the SQL commands manually from `backend/database.sql`.

### Step 2: Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file with your MySQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ems_db
JWT_SECRET=your_super_secret_jwt_key_here
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## Default Login Credentials

- **Username**: admin
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Employees (Requires JWT Token)
- `GET /api/employees` - Get all employees (with pagination, search, filter)
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/stats` - Get dashboard stats
- `GET /api/employees/departments` - Get all departments

### Query Parameters for GET /api/employees
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or phone
- `department` - Filter by department
- `sortBy` - Sort column (id, name, department, salary)
- `order` - Sort order (ASC, DESC)

## Employee Fields

| Field | Type | Validation |
|-------|------|------------|
| name | VARCHAR(100) | Required, min 2 chars |
| department | VARCHAR(50) | Required |
| salary | DECIMAL(10,2) | Required, positive number |
| phone | VARCHAR(20) | Required, valid phone format |

## Features Overview

### Dashboard
- Total employees count
- Average salary
- Department count
- Recent employees list

### Add Employee
- Form with validation
- Dropdown for department selection
- Real-time error feedback

### View Employees
- Searchable table
- Filterable by department
- Sortable columns (click headers)
- Pagination controls
- Edit and Delete actions
- Delete confirmation modal

### Edit Employee
- Pre-populated form
- Same validation as Add

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 24-hour expiration
- Protected routes with middleware
- Input validation on both frontend and backend
- SQL injection prevention via parameterized queries

## Development Notes

- All API responses follow a consistent format:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... }
  }
  ```
- Error responses include appropriate HTTP status codes
- CORS is enabled for frontend-backend communication

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Verify credentials in `.env`
3. Run `node -e "require('./config/database').testConnection()"`

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Set `PORT` environment variable or check package.json

### CORS Errors
- Ensure backend is running
- Check if frontend URL is allowed in CORS configuration (server.js)

## License

MIT License
