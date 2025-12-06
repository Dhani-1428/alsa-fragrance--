# Backend Testing Guide

## Overview

This document describes the comprehensive backend test suite for the Alsa Fragrance application. The test suite covers all API endpoints, MongoDB operations, and backend functionality.

## Running Tests

### Prerequisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Run the test suite:**
   ```bash
   npm run test:backend
   ```

   Or directly:
   ```bash
   tsx scripts/test-backend.ts
   ```

### Environment Variables

The test suite uses the following environment variables (optional):

- `TEST_BASE_URL` - Base URL for API tests (default: `http://localhost:3000`)

## Test Coverage

### 1. MongoDB Connection Tests ✅

- **MongoDB Connection**: Verifies connection to MongoDB Atlas
- **User Model Operations**: Tests CRUD operations on User model
- **Product Model Operations**: Tests CRUD operations on Product model

### 2. Authentication Tests ✅

#### Register Endpoint (`/api/auth/register`)
- ✅ Successful user registration
- ✅ User data validation
- ✅ Password hashing

#### Login Endpoint (`/api/auth/login`)
- ✅ Successful login with valid credentials
- ✅ Invalid credentials handling (401)
- ✅ User data retrieval

### 3. Product API Tests ✅

#### GET `/api/products`
- ✅ Retrieve all products
- ✅ Filter by category (`?category=women`)
- ✅ Filter by sale status (`?onSale=true`)
- ✅ Filter by new status (`?isNew=true`)

#### POST `/api/products`
- ✅ Create new product
- ✅ Product data validation
- ✅ Required fields handling

#### GET `/api/products/[id]`
- ✅ Retrieve single product by ID
- ✅ Product not found handling (404)

#### PUT `/api/products/[id]`
- ✅ Update existing product
- ✅ Partial updates
- ✅ Data validation

#### DELETE `/api/products/[id]`
- ✅ Delete product
- ✅ Verify deletion
- ✅ Product not found handling

### 4. Contact Form Tests ✅

#### POST `/api/contact`
- ✅ Submit contact form
- ✅ Email service integration (may return 503 if not configured)
- ✅ Form data validation

### 5. Checkout Tests ✅

#### POST `/api/checkout`
- ✅ Card payment checkout
- ✅ Order creation
- ✅ Email notifications
- ✅ MBWay payment checkout
- ✅ Pending payment status for MBWay

### 6. File Upload Tests ✅

#### POST `/api/upload`
- ✅ Image file upload
- ✅ File type validation
- ✅ File size validation
- ✅ File storage

### 7. Payment Tests ✅

#### POST `/api/create-payment-intent`
- ✅ Stripe payment intent creation
- ✅ Amount validation
- ⚠️ May fail if Stripe is not configured (acceptable)

## Test Results Interpretation

### Success Indicators

- ✅ **Green checkmark**: Test passed successfully
- ❌ **Red X**: Test failed
- ⚠️ **Warning**: Test may fail due to external service configuration (e.g., Stripe, Resend)

### Common Test Failures

1. **MongoDB Connection Failed**
   - Check MongoDB Atlas connection string
   - Verify network access
   - Check environment variables

2. **API Endpoint Not Found (404)**
   - Ensure development server is running
   - Check BASE_URL configuration
   - Verify route paths

3. **Authentication Failures**
   - Check user exists in database
   - Verify password hashing
   - Check email format

4. **Product Operations Failures**
   - Verify MongoDB connection
   - Check product model schema
   - Verify required fields

5. **External Service Failures (503)**
   - Contact form: Resend API not configured (acceptable)
   - Payment intent: Stripe not configured (acceptable)

## Test Data Management

### Automatic Cleanup

The test suite automatically:
- Creates test users with unique emails (timestamp-based)
- Creates test products for CRUD operations
- Cleans up all test data after tests complete

### Test Data Format

- **Test Email**: `test-{timestamp}@test.com`
- **Test Password**: `test123456`
- **Test Products**: Created with "Test" prefix, automatically deleted

## Manual Testing Checklist

For manual verification, test these scenarios:

### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Register duplicate email (should fail)

### Products
- [ ] View all products
- [ ] Filter products by category
- [ ] Filter products on sale
- [ ] View single product
- [ ] Create new product (admin)
- [ ] Update product (admin)
- [ ] Delete product (admin)

### Checkout
- [ ] Complete checkout with card payment
- [ ] Complete checkout with MBWay payment
- [ ] Verify order confirmation email
- [ ] Verify admin notification email

### Contact Form
- [ ] Submit contact form
- [ ] Verify email sent to admin
- [ ] Test with missing fields (should fail)

### File Upload
- [ ] Upload valid image file
- [ ] Upload invalid file type (should fail)
- [ ] Upload oversized file (should fail)

## Continuous Integration

To integrate into CI/CD:

```yaml
# Example GitHub Actions workflow
name: Backend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run dev &
      - run: sleep 10
      - run: npm run test:backend
```

## Troubleshooting

### Tests Timeout

If tests timeout:
1. Check MongoDB Atlas connection
2. Verify development server is running
3. Check network connectivity
4. Increase timeout values if needed

### MongoDB Connection Issues

```bash
# Verify connection string
echo $MONGODB_URI

# Test connection manually
tsx -e "import('./lib/mongodb').then(m => m.default().then(() => console.log('Connected')))"
```

### API Endpoint Issues

```bash
# Test endpoint manually
curl http://localhost:3000/api/products

# Check server logs
npm run dev
```

## Test Coverage Goals

- ✅ **100% API Endpoint Coverage**
- ✅ **MongoDB Model Operations**
- ✅ **Authentication Flow**
- ✅ **Error Handling**
- ✅ **Data Validation**

## Next Steps

1. Add integration tests for complex workflows
2. Add performance/load testing
3. Add security testing
4. Add end-to-end testing with Playwright/Cypress

---

**Last Updated**: After MongoDB Atlas migration
**Test Suite Version**: 1.0.0

