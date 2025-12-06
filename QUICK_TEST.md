# Quick Test Instructions

## Fastest Way to Run Tests

### Step 1: Start Dev Server
```bash
npm run dev
```
Keep this terminal open!

### Step 2: Open NEW Terminal (Command Prompt)

**Don't use PowerShell** - use Command Prompt (cmd.exe)

### Step 3: Run Tests

**Option A: Double-click batch file**
- Double-click `run-tests-simple.bat`

**Option B: Command line**
```cmd
cd "C:\Users\sheet\Downloads\alsafragrance11 (2)"
node --import tsx scripts/test-backend-simple.ts
```

## What You Should See

```
🚀 Backend Test Suite
📍 Base URL: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 MongoDB Connection... ✅ PASSED
🧪 User Model - Create... ✅ PASSED
🧪 User Model - Find... ✅ PASSED
🧪 Product Model - Create... ✅ PASSED
🧪 API - GET /api/products... ✅ PASSED
🧪 API - GET /api/products?category=women... ✅ PASSED
🧪 API - POST /api/auth/register... ✅ PASSED
🧪 API - POST /api/auth/login... ✅ PASSED
🧪 Cleanup - Delete Test User... ✅ PASSED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tests: 9
✅ Passed: 9
❌ Failed: 0
Success Rate: 100.0%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## If Tests Fail

1. **MongoDB Connection Failed**
   - Check `lib/mongodb.ts` connection string
   - Verify MongoDB Atlas is accessible

2. **API Tests Failed (404)**
   - Make sure dev server is running
   - Check it's on port 3000

3. **No Output**
   - Use Command Prompt, not PowerShell
   - Try the batch file instead

## Test Files Available

- ✅ `scripts/test-backend-simple.ts` - **Start here!**
- ✅ `scripts/test-backend.ts` - Full comprehensive tests
- ✅ `scripts/test-mongodb-only.ts` - Just MongoDB test

---

**Ready to test!** 🚀

