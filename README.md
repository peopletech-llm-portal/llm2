# 🎯 Role-Based MERN Application

A secure role-based user management system built with MongoDB, Express.js, React, and Node.js.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Run the setup script
setup.bat

# Start the application
start.bat
```

**macOS/Linux:**
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh

# Start the application
cd backend && npm run dev &
cd frontend && npm run dev
```

**PowerShell:**
```powershell
# Run the PowerShell setup
.\setup.ps1

# Start the application
.\start.bat
```

### Option 2: Manual Setup

1. **Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

2. **Setup Environment**
```bash
# Create .env file in backend directory
cd backend
# Add environment variables (see below)
```

3. **Create Main Admin**
```bash
cd backend
node scripts/setupMainAdmin.js
```

4. **Start Servers**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 🔧 Environment Setup

Create `backend/.env` file:

```env
# Database
MONGO_URI=mongodb://localhost:27017/llm-portal

# JWT Secret
JWT_SECRET=YourSuperSecretKey123456789

# Main Admin Credentials
MAIN_ADMIN_EMAIL=admin@company.com
MAIN_ADMIN_PASSWORD=StrongAdmin#123

# Server
PORT=5000
```

## 🎭 User Roles

### 👑 Main Admin
- **Access**: Full system control
- **Permissions**: Create/edit/delete Sub Admins and Interns
- **Dashboard**: `/admin/dashboard`
- **Features**: User management, download interns.json

### 👨‍💼 Sub Admin
- **Access**: Intern management only
- **Permissions**: Create/edit/delete Interns only
- **Dashboard**: `/subadmin/dashboard`
- **Features**: Intern management, download interns.json

### 🧑‍🎓 Intern
- **Access**: Read-only dashboard
- **Permissions**: View own profile and training materials
- **Dashboard**: `/intern/dashboard`
- **Login**: Company email OR contact number + password

## 🔐 Authentication

### Login Types
- **Admin Login**: Email + Password (for Main Admin and Sub Admin)
- **Intern Login**: Company Email OR Contact Number + Password

### Security Features
- JWT authentication with 24-hour expiration
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- Protected routes with middleware

## 📊 Features

### ✅ Implemented Features
- [x] Role-based user system (MAIN_ADMIN, SUB_ADMIN, INTERN)
- [x] Secure authentication with JWT
- [x] Password hashing with bcrypt
- [x] Show/hide password toggle
- [x] Automatic interns.json management
- [x] Role-based dashboard redirects
- [x] User management (CRUD operations)
- [x] Download interns.json functionality
- [x] Input validation and sanitization
- [x] Protected routes with middleware

### 🎨 UI/UX Features
- [x] Responsive design
- [x] Modern dashboard interfaces
- [x] Role-based navigation
- [x] Password visibility toggle
- [x] Form validation
- [x] Success/error messaging

## 📁 Project Structure

```
llm2/
├── backend/
│   ├── models/User.js              # User model with roles
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT authentication
│   │   ├── roleMiddleware.js       # Role-based permissions
│   │   └── checkRole.js           # Role validation
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication routes
│   │   └── adminRoutes.js         # Admin management routes
│   ├── utils/internFileUpdater.js # JSON file management
│   ├── data/interns.json          # Intern data file
│   ├── scripts/
│   │   ├── setupMainAdmin.js      # Main admin setup
│   │   └── testSetup.js           # Setup verification
│   ├── server.js                  # Express server
│   └── .env                       # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── MainAdminDashboard.jsx
│   │   │   ├── SubAdminDashboard.jsx
│   │   │   └── InternDashboard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation
│   │   │   └── PrivateRoute.jsx    # Route protection
│   │   └── App.jsx                 # Main app component
│   └── package.json
├── setup.bat                      # Windows setup script
├── setup.sh                       # Unix setup script
├── setup.ps1                      # PowerShell setup script
├── start.bat                      # Start both servers
└── README.md                      # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create user (Admin only)
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - Get users (Admin only)
- `GET /api/auth/interns/download` - Download interns.json

### Admin Management
- `GET /api/admin/users` - Get users (role-filtered)
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/reset-password` - Reset password

## 🧪 Testing

### Test Setup
```bash
cd backend
node scripts/testSetup.js
```

### Manual Testing
1. **Login as Main Admin**
   - Email: admin@company.com
   - Password: StrongAdmin#123

2. **Create Sub Admin**
   - Use Main Admin dashboard
   - Fill form with Sub Admin details

3. **Create Intern**
   - Use Main Admin or Sub Admin dashboard
   - Fill required fields

4. **Test Intern Login**
   - Select "Intern Login"
   - Use company email or contact number

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
```

#### Port Already in Use
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

#### Dependencies Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 Default Credentials

- **Main Admin Email**: admin@company.com
- **Main Admin Password**: StrongAdmin#123
- **Database**: llm-portal
- **Backend Port**: 5000
- **Frontend Port**: 5173

## 🎯 Usage Flow

1. **Setup**: Run setup script or manual setup
2. **Login**: Use Main Admin credentials
3. **Create Users**: Use dashboard to create Sub Admins and Interns
4. **Manage**: Edit, delete, or reset user passwords
5. **Download**: Export interns.json file
6. **Test**: Login with different roles to test permissions

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

### Environment Variables for Production
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/llm-portal
JWT_SECRET=YourProductionSecretKey
MAIN_ADMIN_EMAIL=admin@yourcompany.com
MAIN_ADMIN_PASSWORD=YourSecurePassword
PORT=5000
NODE_ENV=production
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the setup guide
3. Check console for error messages
4. Verify environment variables

---

**Happy Coding! 🎉**