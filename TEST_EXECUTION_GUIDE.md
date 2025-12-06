# Backend Test Execution Guide

## 🚀 Quick Start

### Step 1: Start Development Server
```bash
npm run dev
```
**Keep this terminal running!**

### Step 2: Run Tests

**Option A: Double-click batch file**
- Double-click `run-all-tests.bat`

**Option B: Command Prompt**
```cmd
node --import tsx scripts/test-all-backend.ts
```

**Option C: npm script**
```bash
npm run test:all
```

## 📊 Test Results

After running tests, you'll see:

1. **Real-time output** showing each test as it runs
2. **Summary report** with pass/fail counts
3. **Detailed results** by category
4. **Failed tests list** (if any)

## ✅ Expected Results

### All Tests Should Pass:

```
🚀 Complete Backend Test Suite
📍 Base URL: http://localhost:3000

📦 MONGODB CONNECTION & MODELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[M001] MongoDB Atlas Connection... ✅ PASS
[M002] User Model - Create... ✅ PASS
[M003] User Model - Find... ✅ PASS
[M004] User Model - Password Verification... ✅ PASS
[M005] Product Model - Create... ✅ PASS
[M006] Product Model - Find... ✅ PASS
[M007] Product Model - Update... ✅ PASS

🔐 AUTHENTICATION API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[A001] POST /api/auth/register - Valid Data... ✅ PASS
[A002] POST /api/auth/register - Missing Email... ✅ PASS
[A003] POST /api/auth/login - Valid Credentials... ✅ PASS
[A004] POST /api/auth/login - Invalid Password... ✅ PASS
[A005] POST /api/auth/login - Non-existent User... ✅ PASS

📦 PRODUCT API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[P001] GET /api/products - All Products... ✅ PASS
[P002] GET /api/products?category=women... ✅ PASS
[P003] GET /api/products?onSale=true... ✅ PASS
[P004] GET /api/products?isNew=true... ✅ PASS
[P005] GET /api/products/[id] - Valid ID... ✅ PASS
[P006] GET /api/products/[id] - Invalid ID... ✅ PASS
[P007] POST /api/products - Create Product... ✅ PASS
[P008] PUT /api/products/[id] - Update Product... ✅ PASS
[P009] DELETE /api/products/[id] - Delete Product... ✅ PASS

📧 CONTACT API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[C001] POST /api/contact - Valid Form... ✅ PASS

🛒 CHECKOUT API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[CH001] POST /api/checkout - Card Payment... ✅ PASS
[CH002] POST /api/checkout - MBWay Payment... ✅ PASS

🧹 CLEANUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[CL001] Delete Test User... ✅ PASS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tests: 25
✅ Passed: 25
❌ Failed: 0
⏭️  Skipped: 0
Success Rate: 100.0%
```

## 📋 Test Checklist Reference

See `BACKEND_TEST_CHECKLIST.md` for:
- ✅ Complete list of all test cases
- ❌ Failure scenarios and fixes
- 🔍 Troubleshooting guide
- 📊 Success criteria

## 🎯 What Gets Tested

### MongoDB (7 tests)
- Connection to MongoDB Atlas
- User model CRUD operations
- Product model CRUD operations
- Password verification

### Authentication (5 tests)
- User registration (valid & invalid)
- User login (valid & invalid credentials)
- Error handling

### Products API (9 tests)
- Get all products
- Filter by category, sale, new
- Get single product
- Create, update, delete products
- Error handling (404)

### Contact API (1 test)
- Form submission
- Email service integration

### Checkout API (2 tests)
- Card payment checkout
- MBWay payment checkout
- Order creation

### Cleanup (1 test)
- Test data cleanup

## 🔧 If Tests Fail

1. **Check MongoDB Connection**
   ```bash
   npm run test:mongodb
   ```

2. **Verify Dev Server**
   - Is it running on port 3000?
   - Check server logs for errors

3. **Review Failed Tests**
   - See detailed error messages
   - Check `BACKEND_TEST_CHECKLIST.md` for fixes

4. **Re-run Tests**
   ```bash
   npm run test:all
   ```

## 📝 Test Results File

Results are saved to `test-results.txt` for review.

---

**Ready to test!** 🚀

