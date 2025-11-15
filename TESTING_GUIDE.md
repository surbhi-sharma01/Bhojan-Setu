# Bhojan Setu - Testing Guide

## ✅ **Step-by-Step Testing Checklist**

### **Step 1: Verify Backend is Running** ✅

Your backend should be running and showing:
```
MongoDB Connected: localhost:27017
Server is running on port 5000
Environment: development
API Base URL: http://localhost:5000/api
```

✅ **Backend is ready!**

---

### **Step 2: Test Backend Health Check**

Open your browser and visit:
```
http://localhost:5000/api/health
```

**Expected Result:**
```json
{
  "success": true,
  "message": "Bhojan Setu API is running",
  "timestamp": "..."
}
```

✅ **If you see this, backend is working!**

---

### **Step 3: Test Donor Registration & Login**

1. **Open Frontend:**
   - Navigate to `frontend/donor-login.html` in your browser
   - Or use a local server (Live Server in VS Code)

2. **Register a New Donor:**
   - Click "Register" button
   - Fill in the form:
     - Name: `Test Donor`
     - Email: `donor@test.com`
     - Password: `password123`
     - Phone: `1234567890`
     - Address: `123 Test Street`
   - Click "Register"
   - **Expected:** Should redirect to `donor-dashboard.html`

3. **Test Login:**
   - Go back to `donor-login.html`
   - Enter:
     - Email: `donor@test.com`
     - Password: `password123`
   - Click "Login"
   - **Expected:** Should redirect to `donor-dashboard.html`

✅ **If this works, donor authentication is working!**

---

### **Step 4: Test Donor Dashboard - Create Donation**

1. **On Donor Dashboard:**
   - You should see your name in the header
   - Fill in the donation form:
     - Food Type: `Cooked Food`
     - Quantity: `20 plates`
     - Description: `Fresh vegetarian meals`
     - Pickup Address: `123 Restaurant Street`
     - Pickup Date & Time: Select a future date/time
     - Contact Number: `1234567890`
     - Notes: `Please bring containers`
   - Click "Submit Donation"

2. **Expected Result:**
   - Success message: "✅ Donation posted successfully!"
   - Form should reset
   - Donation should appear in "Past Donations" table

✅ **If this works, donation creation is working!**

---

### **Step 5: Test NGO Registration & Login**

1. **Open NGO Login:**
   - Navigate to `frontend/receive-login.html`

2. **Register a New NGO:**
   - Click "Register" button
   - Fill in the form:
     - NGO Name: `Test NGO`
     - Email: `ngo@test.com`
     - Password: `password123`
     - Contact: `9876543210`
     - Address: `456 NGO Street`
   - Click "Register"
   - **Expected:** Should redirect to `receive-dashboard.html`

3. **Test Login:**
   - Go back to `receive-login.html`
   - Enter:
     - Email: `ngo@test.com`
     - Password: `password123`
   - Click "Login"
   - **Expected:** Should redirect to `receive-dashboard.html`

✅ **If this works, NGO authentication is working!**

---

### **Step 6: Test NGO Dashboard - View & Assign Donations**

1. **On NGO Dashboard:**
   - You should see your NGO name in the header
   - Check "Available Donations" table
   - **Expected:** Should see the donation you created in Step 4

2. **Assign a Donation:**
   - Click "Assign" button next to a donation
   - **Expected:** 
     - Status changes to "Assigned"
     - Button disappears
     - Success alert: "Successfully assigned to donation!"

✅ **If this works, NGO donation assignment is working!**

---

### **Step 7: Verify Donation Status Update**

1. **Go back to Donor Dashboard:**
   - Logout and login as donor again
   - Check "Past Donations" table
   - **Expected:** 
     - Your donation should show status: `assigned`
     - NGO name should appear in "Connected NGO" column

✅ **If this works, full flow is working!**

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: CORS Error**
**Error:** `Access to fetch at 'http://localhost:5000/...' has been blocked by CORS policy`

**Solution:** 
- Make sure backend is running
- Check that `cors()` middleware is enabled in `server.js` (it is ✅)

### **Issue 2: 401 Unauthorized**
**Error:** `No token provided, authorization denied`

**Solution:**
- Make sure you're logged in
- Check browser console for errors
- Try logging out and logging back in

### **Issue 3: Donation Not Appearing**
**Error:** Donations not showing in NGO dashboard

**Solution:**
- Check that donation status is `pending`
- Refresh the NGO dashboard
- Check browser console for errors

### **Issue 4: MongoDB Connection Error**
**Error:** `MongooseError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is running
- Check `.env` file has correct `MONGODB_URI`
- For local MongoDB: `mongodb://localhost:27017/bhojan-setu`

---

## ✅ **Success Checklist**

- [ ] Backend server running on port 5000
- [ ] Health check endpoint working
- [ ] Donor can register and login
- [ ] Donor can create donations
- [ ] NGO can register and login
- [ ] NGO can view available donations
- [ ] NGO can assign donations
- [ ] Donor can see assigned status

---

## 🎉 **If All Tests Pass:**

**Congratulations! Your Bhojan Setu application is fully functional!**

You can now:
- Add more features
- Improve UI/UX
- Deploy to production
- Add more validation
- Add email notifications
- etc.

---

## 📝 **Next Steps (Optional Enhancements)**

1. **Add Email Notifications**
   - Notify donors when NGO assigns their donation
   - Notify NGOs when new donations are available

2. **Add Status Updates**
   - Allow NGOs to update donation status (collected, delivered)
   - Show status history

3. **Add Search & Filters**
   - Filter donations by food type
   - Search by location

4. **Add Profile Management**
   - Allow users to update their profiles
   - Change passwords

5. **Add Notifications**
   - Real-time notifications for new donations
   - Status change notifications


