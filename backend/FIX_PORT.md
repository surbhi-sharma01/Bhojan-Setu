# How to Fix "Port 5000 Already in Use" Error

## Quick Fix Options:

### Option 1: Kill the Process Using Port 5000 (Recommended)

**Windows PowerShell:**
```powershell
# Find the process using port 5000
netstat -ano | findstr :5000

# You'll see output like: TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345
# The last number (12345) is the PID

# Kill the process (replace 12345 with your PID)
taskkill /PID 12345 /F
```

**Windows Command Prompt:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Option 2: Change the Port (Alternative)

1. Open `backend/.env` file
2. Change the PORT:
   ```
   PORT=5001
   ```
3. Update frontend API URLs to use port 5001:
   - In all HTML files, change:
     ```javascript
     window.API_BASE_URL = 'http://localhost:5001';
     ```

### Option 3: Use a Different Port Temporarily

If you just want to test quickly, you can set PORT in the terminal:
```powershell
$env:PORT=5001
npm run dev
```

## Common Causes:

- Previous server instance still running
- Another application using port 5000
- VS Code or another IDE running a server on port 5000

## After Fixing:

1. Restart the server:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   MongoDB Connected: localhost:27017
   Server is running on port 5000
   ```


