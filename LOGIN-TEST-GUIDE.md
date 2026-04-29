## 🔐 Login Test Guide

### Test Credentials

```
Email:    admin@inventory.ai
Password: admin123
```

### How to Test

1. **Open your browser** to http://localhost:3000/signin

2. **Open Browser DevTools** (Press F12)
   - Go to the "Console" tab to see debug messages
   - Go to the "Network" tab to see API requests
   - Go to the "Application" tab > Cookies to see if cookies are set

3. **Try to login** with the credentials above

4. **Check the console** for these messages:
   - "Attempting login..."
   - "Login response: { status: true, data: {...} }"
   - "Login successful, redirecting to dashboard..."

5. **Check the Network tab**:
   - Look for `/api/auth/login` request
   - Check if it returns 200 status
   - Check if the response includes user data

6. **Check Cookies** (Application tab > Cookies > http://localhost:3000):
   - Look for `auth_token` cookie
   - Verify it's set with HttpOnly flag
   - Check expiration date (should be 7 days from now)

### Expected Behavior

✅ After successful login:
- You should see "Login successful" in console
- The page should redirect to http://localhost:3000/dashboard
- Cookie `auth_token` should be visible in Application > Cookies
- Dashboard should load with your user info in top-right corner

### Troubleshooting

If redirect doesn't work:

1. **Clear browser cache and cookies**:
   - Chrome: Ctrl+Shift+Delete -> Clear browsing data
   - Make sure to clear "Cookies" and "Cached images and files"

2. **Try in Incognito/Private mode**:
   - This ensures no cached data interferes

3. **Check console for errors**:
   - Look for any JavaScript errors
   - Look for failed network requests

4. **Check if middleware is running**:
   - Visit http://localhost:3000/dashboard directly (without login)
   - It should redirect you to /signin with a redirect parameter

### Server Status

Make sure the dev server is running:
```powershell
# Check if server is running
Get-Process | Where-Object { $_.ProcessName -eq 'node' }

# If not running, start it:
npm run dev
```

### Database Status

Make sure PostgreSQL is running:
```powershell
# Check Docker containers
docker ps

# Should see: smart_inventory_db - Up X seconds (healthy)
```

### Manual API Test

Test the login API directly:
```powershell
$headers = @{'Content-Type'='application/json'}
$body = @{email='admin@inventory.ai'; password='admin123'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method POST -Headers $headers -Body $body -UseBasicParsing
```

Should return:
- Status: 200
- Body: JSON with user data
- Headers: Set-Cookie with auth_token
