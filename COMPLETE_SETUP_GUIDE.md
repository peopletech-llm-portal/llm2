# 🚀 Complete Setup Guide - Role-Based MERN Application

## 📋 **Prerequisites**

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (optional, for version control)

## 🛠️ **Step 1: Environment Setup**

### 1.1 Create Environment File
Create a `.env` file in the `llm2/backend/` directory:

```bash
# Navigate to backend directory
cd llm2/backend

# Create .env file
touch .env  # On Windows: type nul > .env
```

### 1.2 Add Environment Variables
Open the `.env` file and add:

```env
# Database Connection
MONGO_URI=mongodb://localhost:27017/llm-portal
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/llm-portal

# JWT Secret (use a strong secret)
JWT_SECRET=YourSuperSecretKey123456789

# Main Admin Credentials
MAIN_ADMIN_EMAIL=admin@company.com
MAIN_ADMIN_PASSWORD=StrongAdmin#123

# Server Port
PORT=5000
```

## 🗄️ **Step 2: Database Setup**

### 2.1 Start MongoDB
**Option A: Local MongoDB**
```bash
# Start MongoDB service
# On Windows (if installed as service):
net start MongoDB

# On macOS/Linux:
sudo systemctl start mongod
# or
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a free cluster
- Get your connection string
- Update `MONGO_URI` in `.env` file

### 2.2 Verify Database Connection
```bash
# Test MongoDB connection
mongosh
# or
mongo
```

## 📦 **Step 3: Install Dependencies**

### 3.1 Backend Dependencies
```bash
# Navigate to backend directory
cd llm2/backend

# Install dependencies
npm install

# Verify installation
npm list
```

### 3.2 Frontend Dependencies
```bash
# Navigate to frontend directory (new terminal)
cd llm2/frontend

# Install dependencies
npm install

# Verify installation
npm list
```

## 👤 **Step 4: Create Main Admin**

### 4.1 Run Setup Script
```bash
# From backend directory
cd llm2/backend

# Run the setup script to create main admin
node scripts/setupMainAdmin.js
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Main admin created successfully
📧 Email: admin@company.com
🔑 Password: StrongAdmin#123
```

### 4.2 Verify Admin Creation
```bash
# Test the setup
node scripts/testSetup.js
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Main admin exists: admin@company.com
📊 Available roles: ['MAIN_ADMIN']
👥 User counts by role: [{ _id: 'MAIN_ADMIN', count: 1 }]
✅ Setup test completed
```

## 🚀 **Step 5: Start the Application**

### 5.1 Start Backend Server
```bash
# From backend directory
cd llm2/backend

# Start development server
npm run dev

# Alternative: Start production server
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

### 5.2 Start Frontend Server
```bash
# From frontend directory (new terminal)
cd llm2/frontend

# Start development server
npm run dev

# Alternative: Start production build
npm run build
npm run preview
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🌐 **Step 6: Access the Application**

### 6.1 Open in Browser
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### 6.2 Login as Main Admin
1. Go to http://localhost:5173/login
2. Select "Admin Login"
3. Enter credentials:
   - **Email**: admin@company.com
   - **Password**: StrongAdmin#123
4. Click "Login"
5. You'll be redirected to `/admin/dashboard`

## 🧪 **Step 7: Test the System**

### 7.1 Test Main Admin Features
1. **Create Sub Admin**:
   - Click "Create User" in dashboard
   - Fill form with Sub Admin details
   - Select role: "Sub Admin"
   - Submit

2. **Create Intern**:
   - Click "Create User" in dashboard
   - Fill form with Intern details
   - Select role: "Intern"
   - Fill required fields (Employee ID, Company Email, Contact Number, Username)
   - Submit

3. **Download interns.json**:
   - Click "Download Interns JSON" button
   - File should download automatically

### 7.2 Test Sub Admin Login
1. Logout from Main Admin
2. Login with Sub Admin credentials
3. Verify you can only see Interns
4. Test creating new Interns

### 7.3 Test Intern Login
1. Logout from Sub Admin
2. Go to login page
3. Select "Intern Login"
4. Use company email OR contact number + password
5. Verify read-only dashboard access

## 🔧 **Troubleshooting**

### Common Issues & Solutions

#### **MongoDB Connection Error**
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
```

#### **Port Already in Use**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

#### **Dependencies Issues**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **Environment Variables Not Loading**
- Ensure `.env` file is in `llm2/backend/` directory
- Check file has no extra spaces or quotes
- Restart the server after changes

## 📁 **Project Structure**

```
llm2/
├── backend/
│   ├── models/User.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── checkRole.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/internFileUpdater.js
│   ├── data/interns.json
│   ├── scripts/
│   │   ├── setupMainAdmin.js
│   │   └── testSetup.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── MainAdminDashboard.jsx
    │   │   ├── SubAdminDashboard.jsx
    │   │   └── InternDashboard.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   └── App.jsx
    └── package.json
```

## 🎯 **Quick Start Commands**

```bash
# 1. Setup environment
cd llm2/backend
cp .env.example .env  # Edit with your values

# 2. Install dependencies
npm install
cd ../frontend
npm install

# 3. Create main admin
cd ../backend
node scripts/setupMainAdmin.js

# 4. Start servers
npm run dev  # Backend
cd ../frontend && npm run dev  # Frontend (new terminal)

# 5. Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## 🔐 **Default Credentials**

- **Main Admin Email**: admin@company.com
- **Main Admin Password**: StrongAdmin#123
- **Database**: llm-portal
- **Backend Port**: 5000
- **Frontend Port**: 5173

## ✅ **Verification Checklist**

- [ ] MongoDB is running
- [ ] Environment variables are set
- [ ] Dependencies are installed
- [ ] Main admin is created
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] Can login as Main Admin
- [ ] Can create Sub Admin
- [ ] Can create Intern
- [ ] Can download interns.json
- [ ] Role-based redirects work
- [ ] Show password feature works

## 🎉 **Success!**

Your role-based MERN application is now fully set up and running! You can start creating users and managing the system through the admin dashboards.

**Next Steps:**
1. Create your first Sub Admin
2. Create some Interns
3. Test the complete user flow
4. Customize the system as needed

Happy coding! 🚀
