# Backend Test Checklist - Success & Failure Cases

## 📋 Complete Test Case Checklist

This document provides a comprehensive checklist for all backend tests, including expected success and failure scenarios.

---

## 🗂️ Test Categories

### 1. MongoDB Connection & Models
### 2. Authentication API
### 3. Product API
### 4. Contact API
### 5. Checkout API
### 6. Cleanup

---

## 📦 1. MONGODB CONNECTION & MODELS

### ✅ Success Cases

| Test ID | Test Case | Expected Result | Success Criteria |
|---------|-----------|----------------|-------------------|
| M001 | MongoDB Atlas Connection | ✅ PASS | Successfully connects to MongoDB Atlas |
| M002 | User Model - Create | ✅ PASS | User created with valid _id |
| M003 | User Model - Find | ✅ PASS | User found by email |
| M004 | User Model - Password Verification | ✅ PASS | Password hash verified correctly |
| M005 | Product Model - Create | ✅ PASS | Product created with valid _id |
| M006 | Product Model - Find | ✅ PASS | Products found by category |
| M007 | Product Model - Update | ✅ PASS | Product updated successfully |

### ❌ Failure Cases

| Test ID | Failure Scenario | Expected Behavior | How to Fix |
|---------|------------------|-------------------|------------|
| M001-F | Connection string invalid | ❌ FAIL | Check `lib/mongodb.ts` connection string |
| M001-F | Network access denied | ❌ FAIL | Verify IP whitelist in MongoDB Atlas |
| M001-F | Authentication failed | ❌ FAIL | Check username/password in connection string |
| M002-F | Missing required fields | ❌ FAIL | Ensure email, password provided |
| M002-F | Duplicate email | ❌ FAIL | Use unique email for each test |
| M003-F | User not found | ❌ FAIL | Verify user exists before finding |
| M004-F | Wrong password | ❌ FAIL | Use correct password for verification |
| M005-F | Invalid product data | ❌ FAIL | Provide all required product fields |
| M007-F | Product not found | ❌ FAIL | Verify product ID exists before update |

---

## 🔐 2. AUTHENTICATION API

### ✅ Success Cases

| Test ID | Test Case | Expected Result | Success Criteria |
|---------|-----------|----------------|-------------------|
| A001 | POST /api/auth/register - Valid Data | ✅ PASS | Status 201, user object returned |
| A002 | POST /api/auth/register - Missing Email | ✅ PASS | Status 400 (validation error) |
| A003 | POST /api/auth/login - Valid Credentials | ✅ PASS | Status 200, user object returned |
| A004 | POST /api/auth/login - Invalid Password | ✅ PASS | Status 401 (unauthorized) |
| A005 | POST /api/auth/login - Non-existent User | ✅ PASS | Status 401 (unauthorized) |

### ❌ Failure Cases

| Test ID | Failure Scenario | Expected Behavior | How to Fix |
|---------|------------------|-------------------|------------|
| A001-F | Server not running | ❌ FAIL | Start dev server: `npm run dev` |
| A001-F | MongoDB connection failed | ❌ FAIL | Check MongoDB connection |
| A001-F | Duplicate email registration | ❌ FAIL | Use unique email or handle duplicate |
| A002-F | Missing email not rejected | ⚠️ WARNING | API should validate required fields |
| A003-F | Valid login fails | ❌ FAIL | Check user exists, password correct |
| A003-F | Wrong status code | ❌ FAIL | Verify API returns 200 for success |
| A004-F | Invalid password accepted | ⚠️ WARNING | API should reject wrong passwords |
| A005-F | Non-existent user accepted | ⚠️ WARNING | API should reject non-existent users |

---

## 📦 3. PRODUCT API

### ✅ Success Cases

| Test ID | Test Case | Expected Result | Success Criteria |
|---------|-----------|----------------|-------------------|
| P001 | GET /api/products - All Products | ✅ PASS | Status 200, array of products |
| P002 | GET /api/products?category=women | ✅ PASS | Status 200, filtered products |
| P003 | GET /api/products?onSale=true | ✅ PASS | Status 200, only sale products |
| P004 | GET /api/products?isNew=true | ✅ PASS | Status 200, only new products |
| P005 | GET /api/products/[id] - Valid ID | ✅ PASS | Status 200, single product object |
| P006 | GET /api/products/[id] - Invalid ID | ✅ PASS | Status 404 (not found) |
| P007 | POST /api/products - Create Product | ✅ PASS | Status 201, product with ID |
| P008 | PUT /api/products/[id] - Update Product | ✅ PASS | Status 200, updated product |
| P009 | DELETE /api/products/[id] - Delete Product | ✅ PASS | Status 200, deletion confirmed |

### ❌ Failure Cases

| Test ID | Failure Scenario | Expected Behavior | How to Fix |
|---------|------------------|-------------------|------------|
| P001-F | No products returned | ⚠️ WARNING | Check if database has products |
| P001-F | Wrong response format | ❌ FAIL | Verify API returns array |
| P002-F | Category filter not working | ❌ FAIL | Check filter logic in API |
| P003-F | Sale filter not working | ❌ FAIL | Verify isSale field filtering |
| P005-F | Product not found (valid ID) | ❌ FAIL | Check product exists in database |
| P006-F | Invalid ID returns 200 | ⚠️ WARNING | API should return 404 for invalid IDs |
| P007-F | Missing required fields | ❌ FAIL | Provide all required product fields |
| P007-F | Invalid data types | ❌ FAIL | Ensure correct data types |
| P008-F | Update non-existent product | ❌ FAIL | Verify product exists before update |
| P009-F | Delete non-existent product | ❌ FAIL | Verify product exists before delete |

---

## 📧 4. CONTACT API

### ✅ Success Cases

| Test ID | Test Case | Expected Result | Success Criteria |
|---------|-----------|----------------|-------------------|
| C001 | POST /api/contact - Valid Form | ✅ PASS | Status 200 or 503 (if Resend not configured) |

### ❌ Failure Cases

| Test ID | Failure Scenario | Expected Behavior | How to Fix |
|---------|------------------|-------------------|------------|
| C001-F | Missing required fields | ❌ FAIL | Provide name, email, subject, message |
| C001-F | Invalid email format | ❌ FAIL | Use valid email format |
| C001-F | Resend API not configured | ⚠️ ACCEPTABLE | Returns 503, configure RESEND_API_KEY |
| C001-F | Server error | ❌ FAIL | Check server logs for errors |

---

## 🛒 5. CHECKOUT API

### ✅ Success Cases

| Test ID | Test Case | Expected Result | Success Criteria |
|---------|-----------|----------------|-------------------|
| CH001 | POST /api/checkout - Card Payment | ✅ PASS | Status 200, order created, orderId returned |
| CH002 | POST /api/checkout - MBWay Payment | ✅ PASS | Status 200, order created, isMBWayPending: true |

### ❌ Failure Cases

| Test ID | Failure Scenario | Expected Behavior | How to Fix |
|---------|------------------|-------------------|------------|
| CH001-F | Missing billing info | ❌ FAIL | Provide all billing information |
| CH001-F | Empty cart items | ❌ FAIL | Provide at least one cart item |
| CH001-F | Invalid product ID | ❌ FAIL | Use valid product IDs |
| CH001-F | Email sending fails | ⚠️ WARNING | Check SMTP configuration |
| CH002-F | MBWay payment not pending | ⚠️ WARNING | Verify isMBWayPending flag set |
| CH002-F | Order not created | ❌ FAIL | Check order creation logic |

---

## 🧹 6. CLEANUP

### ✅ Success Cases

| Test ID | Test Case | Expected Result | Success Criteria |
|---------|-----------|----------------|-------------------|
| CL001 | Delete Test User | ✅ PASS | Test user deleted successfully |

### ❌ Failure Cases

| Test ID | Failure Scenario | Expected Behavior | How to Fix |
|---------|------------------|-------------------|------------|
| CL001-F | User not deleted | ⚠️ WARNING | Check delete operation, may not affect test results |

---

## 📊 Test Execution Summary

### Running All Tests

```bash
# Full comprehensive test suite
node --import tsx scripts/test-all-backend.ts

# Simple test suite
node --import tsx scripts/test-backend-simple.ts

# MongoDB connection only
node --import tsx scripts/test-mongodb-only.ts
```

### Expected Test Results

**Ideal Scenario:**
- ✅ Total Tests: 25+
- ✅ Passed: 25+
- ❌ Failed: 0
- Success Rate: 100%

**Acceptable Scenarios:**
- Contact form may return 503 if Resend not configured (acceptable)
- Payment intent may fail if Stripe not configured (acceptable)
- Some tests may be skipped if prerequisites not met

---

## 🔍 Troubleshooting Guide

### Common Issues

#### 1. MongoDB Connection Failed
**Symptoms:** M001 test fails
**Solutions:**
- Check connection string in `lib/mongodb.ts`
- Verify MongoDB Atlas is accessible
- Check IP whitelist in MongoDB Atlas dashboard
- Verify credentials are correct

#### 2. API Tests Return 404
**Symptoms:** All API tests fail with 404
**Solutions:**
- Ensure dev server is running: `npm run dev`
- Verify server is on port 3000
- Check API route paths are correct

#### 3. Authentication Tests Fail
**Symptoms:** A001-A005 tests fail
**Solutions:**
- Verify user exists in database
- Check password hashing is working
- Ensure email format is valid
- Verify MongoDB connection

#### 4. Product Tests Fail
**Symptoms:** P001-P009 tests fail
**Solutions:**
- Check products exist in database
- Verify MongoDB connection
- Check product model schema
- Ensure required fields are provided

#### 5. Checkout Tests Fail
**Symptoms:** CH001-CH002 tests fail
**Solutions:**
- Ensure products exist for checkout
- Verify billing info format
- Check cart items structure
- Verify order creation logic

---

## ✅ Pre-Test Checklist

Before running tests, ensure:

- [ ] Development server is running (`npm run dev`)
- [ ] MongoDB Atlas is accessible
- [ ] Connection string is correct in `lib/mongodb.ts`
- [ ] Network access configured in MongoDB Atlas
- [ ] Node modules installed (`npm install`)
- [ ] Test scripts are executable

---

## 📈 Success Criteria

### Minimum Acceptable Results

- ✅ MongoDB Connection: MUST PASS
- ✅ User Model Operations: MUST PASS (3/3)
- ✅ Product Model Operations: MUST PASS (3/3)
- ✅ Authentication - Valid Cases: MUST PASS (3/3)
- ✅ Authentication - Invalid Cases: MUST PASS (2/2)
- ✅ Product API - GET: MUST PASS (4/4)
- ✅ Product API - CRUD: MUST PASS (3/3)
- ⚠️ Contact API: ACCEPTABLE if 503 (Resend not configured)
- ✅ Checkout API: MUST PASS (2/2)

### Critical Tests (Must Pass)

These tests are critical for basic functionality:

1. **M001** - MongoDB Connection
2. **A001** - User Registration
3. **A003** - User Login
4. **P001** - Get All Products
5. **P007** - Create Product
6. **CH001** - Checkout with Card

---

## 📝 Test Report Template

After running tests, document:

```
Test Run Date: ___________
Test Suite Version: ___________
Environment: ___________

Results:
- Total Tests: _____
- Passed: _____
- Failed: _____
- Success Rate: _____%

Critical Failures:
1. ___________
2. ___________

Notes:
___________
```

---

## 🎯 Next Steps After Testing

1. **Review Failed Tests** - Identify root causes
2. **Fix Critical Issues** - Address must-pass test failures
3. **Re-run Tests** - Verify fixes
4. **Document Issues** - Note any acceptable failures
5. **Update Checklist** - Add new test cases if needed

---

**Last Updated:** After MongoDB Atlas Migration
**Test Suite Version:** 1.0.0

