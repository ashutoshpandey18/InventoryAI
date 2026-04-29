# 🔍 Debug Login Issue - Step by Step Guide

## ✅ Server Verification (DONE)
- ✅ Dev server is running on port 3000
- ✅ Database is connected and healthy
- ✅ Test user created: `admin@inventory.ai` / `admin123`
- ✅ Login API works (returns 200 with cookie)
- ✅ Cookie is set correctly (HttpOnly, path=/)

## 🌐 Browser Testing Instructions

### Step 1: Clear Browser Data
**IMPORTANT: Do this first!**

1. Open Chrome/Edge
2. Press `Ctrl + Shift + Delete`
3. Select **"All time"**
4. Check:
   - ✅ Cookies and other site data
   - ✅ Cached images and files
5. Click **"Clear data"**
6. **Close and reopen the browser completely**

### Step 2: Open Developer Tools
1. Open: http://localhost:3000/signin
2. Press `F12` to open DevTools
3. Go to **"Console"** tab
4. Keep it open during login

### Step 3: Try to Login

Enter credentials:
```
Email:    admin@inventory.ai
Password: admin123
```

Click "Sign In"

### Step 4: Check Console Output

You should see these messages in order:
```
🔐 Attempting login with: admin@inventory.ai
📡 Response status: 200 OK
✅ Login successful: {success: true, user: {...}, message: 'Login successful'}
🚀 Redirecting to dashboard...
```

### Step 5: What Should Happen
- Page should redirect to `/dashboard`
- You should see the dashboard with your name/email in the top-right corner
- Sidebar should be visible on the left

## 🐛 Troubleshooting

### Issue: Nothing happens when clicking "Sign In"

**Check Console for errors:**
- Look for red error messages
- Look for network request failures

**Check Network tab:**
1. Go to DevTools > Network tab
2. Click "Sign In" button
3. Look for `/api/auth/login` request
   - Should show Status 200
   - Check Response tab for success message
   - Check Headers tab for "Set-Cookie"

### Issue: Error message appears

**Common errors and solutions:**

1. **"Invalid email or password"**
   - Make sure you're using: `admin@inventory.ai` / `admin123`
   - Check for extra spaces in email/password

2. **"Failed to sign in"**
   - Check if server is running: http://localhost:3000
   - Check console for detailed error

3. **Network error / Connection refused**
   - Server crashed - restart it:
   ```powershell
   npm run dev
   ```

### Issue: Redirects to /signin instead of /dashboard

This means cookie isn't being set.

**Check in DevTools:**
1. Go to Application tab
2. Click "Cookies" > "http://localhost:3000"
3. Look for `auth_token` cookie
   - If missing, there's a cookie setting issue
   - If present but still redirecting, token might be invalid

**Solution:**
```powershell
# Restart dev server
Get-Process -Name node | Stop-Process -Force
npm run dev
```

### Issue: Page just stays on signin with loading spinner

**Check browser console for JavaScript errors**

If you see any errors, copy them and let me know.

## 🧪 Manual API Test

Test the API directly in PowerShell:

```powershell
$headers = @{'Content-Type'='application/json'}
$body = @{email='admin@inventory.ai'; password='admin123'} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri 'http://localhost:3000/api/auth/login' `
  -Method POST `
  -Headers $headers `
  -Body $body `
  -UseBasicParsing

Write-Host "Status: $($response.StatusCode)"
Write-Host "Body: $($response.Content)"
```

Should return:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@inventory.ai",
    "name": "Admin User",
    "role": "OWNER"
  },
  "message": "Login successful"
}
```

## 🎯 Expected Working Flow

1. Enter credentials → Click Sign In
2. See console: "🔐 Attempting login..."
3. See console: "📡 Response status: 200 OK"
4. See console: "✅ Login successful"
5. See console: "🚀 Redirecting to dashboard..."
6. **Page navigates to /dashboard**
7. Dashboard loads with user info in top-right

## 📞 Need More Help?

If following all these steps doesn't work, provide:
1. Screenshot of browser console (with all messages)
2. Screenshot of Network tab showing the login request
3. Screenshot of Application > Cookies
4. Any error messages you see

The login API is confirmed working on the backend, so any issue is likely:
- Browser cache not cleared
- JavaScript error in browser
- Cookie not being saved by browser
