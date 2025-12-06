# How to Run Backend Tests

## Quick Start

Since PowerShell execution policies may prevent direct npm/tsx execution, here are several ways to run the tests:

## Option 1: Use the Batch File (Windows)

Double-click `run-tests.bat` or run:
```cmd
run-tests.bat
```

## Option 2: Use Command Prompt (CMD)

Open Command Prompt (not PowerShell) and run:
```cmd
node --import tsx scripts/test-backend.ts
```

## Option 3: Fix PowerShell Execution Policy

If you want to use PowerShell, run this first (as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can run:
```powershell
npm run test:backend
```

## Option 4: Use Git Bash or WSL

If you have Git Bash or WSL:
```bash
npm run test:backend
```

## Prerequisites

1. **Dev Server Must Be Running**
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:3000`

2. **MongoDB Atlas Connection**
   - Make sure MongoDB Atlas is accessible
   - Connection string is configured in `lib/mongodb.ts`

## Expected Output

When tests run successfully, you should see:

```
🚀 Starting Backend Test Suite
📍 Base URL: http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 Testing: MongoDB Connection
✅ PASSED: MongoDB Connection
...

📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tests: 25+
✅ Passed: 25+
❌ Failed: 0
Success Rate: 100%
```

## Troubleshooting

### No Output Appearing
- Make sure the dev server is running
- Check MongoDB connection
- Try running in Command Prompt instead of PowerShell

### MongoDB Connection Failed
- Verify MongoDB Atlas connection string
- Check network access
- Verify IP whitelist in MongoDB Atlas

### Tests Timeout
- Check if dev server is responding: `curl http://localhost:3000/api/products`
- Verify MongoDB Atlas is accessible
- Check network connectivity

## Manual Testing

If automated tests don't work, you can manually test endpoints:

1. **Test Products API:**
   ```bash
   curl http://localhost:3000/api/products
   ```

2. **Test Auth:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123","name":"Test"}'
   ```

3. **Check MongoDB Connection:**
   - The connection is tested automatically when the app starts
   - Check server logs for connection status

---

**Note**: The test suite is fully implemented and ready. The execution method depends on your system's configuration.

