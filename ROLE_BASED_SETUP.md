# Role-Based User System Setup Guide

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/llm-portal
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/llm-portal

# JWT Secret
JWT_SECRET=YourSuperSecretKey123456789

# Main Admin Credentials
MAIN_ADMIN_EMAIL=admin@company.com
MAIN_ADMIN_PASSWORD=StrongAdmin#123

# Server
PORT=5000
```

## Setup Instructions

### 1. Backend Setup

1. Install dependencies:
```bash
cd llm2/backend
npm install
```

2. Set up environment variables (create `.env` file as shown above)

3. Create the initial Main Admin user:
```bash
node scripts/setupMainAdmin.js
```

4. Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

1. Install dependencies:
```bash
cd llm2/frontend
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

## User Roles

### Main Admin
- **Login**: Email + Password
- **Access**: Can create/edit/delete Sub Admins and Interns
- **Dashboard**: `/admin/dashboard`
- **Features**: Full user management, download interns.json

### Sub Admin
- **Login**: Email + Password
- **Access**: Can create/edit/delete Interns only
- **Dashboard**: `/subadmin/dashboard`
- **Features**: Intern management, download interns.json

### Intern
- **Login**: Company Email OR Contact Number + Password
- **Access**: Read-only dashboard
- **Dashboard**: `/intern/home`
- **Features**: View profile, training materials, schedules

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with role-based authentication
- `POST /api/auth/register` - Register new users (Admin only)
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - Get all users (Admin only)
- `GET /api/auth/interns/download` - Download interns.json

### Admin Management
- `GET /api/admin/users` - Get users (role-filtered)
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/reset-password` - Reset password
- `POST /api/admin/create-main-admin` - Create main admin (setup only)

## Intern Data JSON

The system automatically maintains `/backend/data/interns.json` with the following structure:

```json
[
  {
    "employeeId": "INT001",
    "name": "Jane Doe",
    "username": "jane123",
    "companyEmail": "jane@company.com",
    "personalEmail": "jane@gmail.com",
    "contactNumber": "9876543210",
    "createdBy": "SUB001",
    "updatedAt": "2025-10-21T09:30:00Z"
  }
]
```

## Security Features

- JWT-based authentication with 24-hour expiration
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes with middleware
- Automatic interns.json updates

## Testing the System

1. **Create Main Admin**: Run the setup script
2. **Login as Main Admin**: Use the credentials from setup
3. **Create Sub Admin**: Use the Main Admin dashboard
4. **Create Interns**: Use either Main Admin or Sub Admin dashboard
5. **Test Intern Login**: Use company email or contact number
6. **Download interns.json**: Available from admin dashboards

## Troubleshooting

- Ensure MongoDB is running
- Check environment variables are set correctly
- Verify JWT_SECRET is consistent
- Check console for error messages
- Ensure all dependencies are installed
