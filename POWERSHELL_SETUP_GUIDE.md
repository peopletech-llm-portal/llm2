# 🚀 PowerShell Setup Guide - Role-Based MERN Application

## ✅ **Quick Start (PowerShell)**

### Option 1: Automated Setup
```powershell
# Run the PowerShell setup script
.\setup.ps1

# Start both servers
.\start-servers.ps1
```

### Option 2: Manual Setup
```powershell
# 1. Install Backend Dependencies
cd llm2\backend
npm install

# 2. Install Frontend Dependencies
cd ..\frontend
npm install

# 3. Create Main Admin (if not already done)
cd ..\backend
node scripts\setupMainAdmin.js

# 4. Start Backend Server
npm run dev

# 5. Start Frontend Server (in new terminal)
cd ..\frontend
npm run dev
```

## 🔧 **Individual Server Commands**

### Start Backend Only
```powershell
.\start-backend.ps1
```

### Start Frontend Only
```powershell
.\start-frontend.ps1
```

### Start Both Servers
```powershell
.\start-servers.ps1
```

### Check Server Status
```powershell
.\check-status.ps1
```

## 📁 **Available Scripts**

| Script | Purpose | Command |
|--------|---------|---------|
| `setup.ps1` | Install dependencies and setup admin | `.\setup.ps1` |
| `start-servers.ps1` | Start both servers | `.\start-servers.ps1` |
| `start-backend.ps1` | Start backend only | `.\start-backend.ps1` |
| `start-frontend.ps1` | Start frontend only | `.\start-frontend.ps1` |
| `check-status.ps1` | Check if servers are running | `.\check-status.ps1` |
| `start-servers.bat` | Windows batch version | `start-servers.bat` |

## 🌐 **Access URLs**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔐 **Default Credentials**

- **Email**: admin@company.com
- **Password**: StrongAdmin#123

## 🎯 **Step-by-Step Instructions**

### 1. **Setup Environment**
```powershell
# Navigate to project directory
cd "C:\Users\Jeevan\OneDrive - Ramp Group Technologies\Desktop\LLM\llm2"

# Create .env file in backend directory
# Add the following content to backend\.env:
```

**Environment Variables (.env file):**
```env
MONGO_URI=mongodb://localhost:27017/llm-portal
JWT_SECRET=YourSuperSecretKey123456789
MAIN_ADMIN_EMAIL=admin@company.com
MAIN_ADMIN_PASSWORD=StrongAdmin#123
PORT=5000
```

### 2. **Install Dependencies**
```powershell
# Backend
cd llm2\backend
npm install

# Frontend
cd ..\frontend
npm install
```

### 3. **Create Main Admin**
```powershell
cd ..\backend
node scripts\setupMainAdmin.js
```

### 4. **Start Servers**
```powershell
# Option A: Start both servers
.\start-servers.ps1

# Option B: Start individually
# Terminal 1 - Backend
.\start-backend.ps1

# Terminal 2 - Frontend
.\start-frontend.ps1
```

### 5. **Verify Setup**
```powershell
.\check-status.ps1
```

## 🧪 **Testing the Application**

1. **Open Browser**: Go to http://localhost:5173
2. **Select Login Type**: Choose "Admin Login"
3. **Enter Credentials**:
   - Email: admin@company.com
   - Password: StrongAdmin#123
4. **Login**: Click the Login button
5. **Dashboard**: You'll be redirected to the Main Admin dashboard

## 🔧 **Troubleshooting**

### Common PowerShell Issues

#### **Execution Policy Error**
```powershell
# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **Path Issues**
```powershell
# Use full paths if needed
cd "C:\Users\Jeevan\OneDrive - Ramp Group Technologies\Desktop\LLM\llm2"
```

#### **Port Already in Use**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### **MongoDB Connection Error**
```powershell
# Check if MongoDB is running
net start MongoDB
```

## 📊 **Server Status Check**

Run the status check to see if everything is working:
```powershell
.\check-status.ps1
```

This will show:
- ✅ Backend server status
- ✅ Frontend server status
- 🌐 Access URLs
- 🔐 Login credentials
- 📝 Next steps

## 🎉 **Success Indicators**

When everything is working, you should see:
- ✅ Backend server running on port 5000
- ✅ Frontend server running on port 5173
- ✅ Can access http://localhost:5173
- ✅ Can login with admin credentials
- ✅ Redirected to Main Admin dashboard

## 🚀 **Next Steps After Setup**

1. **Login as Main Admin**
2. **Create Sub Admin** from dashboard
3. **Create Interns** with required details
4. **Test role-based access**
5. **Download interns.json** file

Your role-based MERN application is now ready! 🎉
