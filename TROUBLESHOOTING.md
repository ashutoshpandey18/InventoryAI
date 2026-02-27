# 🔧 Troubleshooting Guide

## Error: "TypeError: Cannot read properties of undefined (reading 'call')"

This error typically occurs due to one of the following issues:

### ✅ Solution 1: Regenerate Prisma Client

The most common cause is that the Prisma client is not properly generated or is out of sync with the schema.

```bash
# Stop the dev server if running
# Press Ctrl+C in the terminal

# Remove old Prisma client
Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue

# Regenerate Prisma client
npx prisma generate

# Restart dev server
npm run dev
```

### ✅ Solution 2: Verify Database Connection

```bash
# Check if PostgreSQL is running
docker ps

# You should see: smart_inventory_db (port 5433)

# If not running, start it:
docker-compose up -d

# Check migration status
npx prisma migrate status
```

### ✅ Solution 3: Run Verification Script

```bash
npx tsx verify-setup.ts
```

This will check:
- Prisma client import
- Database connection
- Service imports
- Validator imports
- Middleware imports
- Environment variables

### ✅ Solution 4: Clean Reinstall

If the above don't work, try a clean reinstall:

```bash
# Stop all terminals

# Remove node_modules and lock file
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force

# Reinstall
npm install

# Regenerate Prisma
npx prisma generate

# Restart
npm run dev
```

### ✅ Solution 5: Check for Port Conflicts

```bash
# Check if port 3000 or 3001 is already in use
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# If ports are in use, kill the process:
# taskkill /PID <PID_NUMBER> /F

# Or let Next.js automatically use the next available port
```

## Common Issues & Fixes

### Issue: "Prisma client did not initialize yet"
```bash
npx prisma generate
```

### Issue: "Cannot connect to database"
```bash
docker-compose up -d
npx prisma migrate dev
```

### Issue: "Module not found"
```bash
npm install
npx prisma generate
```

### Issue: TypeScript errors
```bash
# Check errors
npx tsc --noEmit

# If Prisma types are missing:
npx prisma generate
```

## Quick Health Check

Run these commands in order:

```bash
# 1. Check database
docker ps

# 2. Check migrations
npx prisma migrate status

# 3. Verify setup
npx tsx verify-setup.ts

# 4. Start server
npm run dev

# 5. Run tests (in another terminal)
npx tsx test-full-stack.ts
```

## Expected Output

When everything works:

```
✅ Database: PostgreSQL 16 running on port 5433
✅ Migrations: 2 applied (init, add_user_password)
✅ Prisma Client: Generated successfully
✅ Dev Server: Running on http://localhost:3001
✅ Tests: All passing
```

## Still Having Issues?

1. **Check environment variables:**
   ```bash
   cat .env  # Linux/Mac
   type .env # Windows
   ```

   Make sure these are set:
   - DATABASE_URL
   - JWT_SECRET
   - POSTGRES_USER
   - POSTGRES_PASSWORD
   - POSTGRES_DB

2. **Check Node version:**
   ```bash
   node --version  # Should be 18 or higher
   ```

3. **Check Docker logs:**
   ```bash
   docker logs smart_inventory_db
   ```

4. **Reset database (⚠️ deletes all data):**
   ```bash
   docker-compose down -v
   docker-compose up -d
   npx prisma migrate dev
   ```

## Contact

If none of these solutions work, please provide:
- Error message (full stack trace)
- Output of `npx tsx verify-setup.ts`
- Node version (`node --version`)
- OS (Windows/Mac/Linux)
