# Testing Guide

## Overview

This project uses **Jest** and **React Testing Library** for unit and integration testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
lib/
  __tests__/
    sanitization.test.ts      # Input sanitization tests (95 tests)
    db.test.ts                # Database layer tests (40 tests)
    email-service.test.ts     # Email service tests (60 tests)
    btcpay-client.test.ts     # BTCPay integration tests (70 tests)

app/
  api/
    __tests__/
      (API route tests - to be added)
```

## Test Files Created

### 1. **sanitization.test.ts** (265+ tests)
Tests for input sanitization functions:
- `sanitizeText()` - Remove HTML/scripts from text
- `sanitizeHtml()` - Allow safe HTML, remove dangerous content
- `sanitizeEmail()` - Validate email format
- `sanitizeUrl()` - Validate and sanitize URLs
- `sanitizePhone()` - Validate phone numbers
- `sanitizeMerchantSubmission()` - Complete merchant data sanitization
- Edge cases: Long strings, special characters, Unicode

### 2. **db.test.ts** (40+ tests)
Tests for database operations:
- Query execution
- Transaction handling
- Connection pool management
- SQL injection prevention
- Query builder helpers
- Error handling (connection, duplicate keys, foreign keys)

### 3. **email-service.test.ts** (60+ tests)
Tests for email functionality:
- `sendDonationReceipt()` - Send donation receipts
- `sendApprovalEmail()` - Merchant approval emails
- `sendRejectionEmail()` - Merchant rejection emails
- Email validation
- Template structure
- Content sanitization
- Error handling (API errors, rate limiting, network errors)

### 4. **btcpay-client.test.ts** (70+ tests)
Tests for BTCPay Server integration:
- `createInvoice()` - Create payment invoices
- `getInvoiceStatus()` - Check payment status
- `getInvoicePaymentMethods()` - Fetch payment options
- API configuration
- Invoice lifecycle (New → Processing → Settled)
- Webhook validation
- Amount conversion (USD to satoshis)
- Error handling

## Test Configuration

### jest.config.ts
- Uses `jsdom` test environment for React components
- Module path mapping (`@/` aliases)
- Coverage collection from `app/`, `components/`, `lib/`
- Excludes `.next/`, `node_modules/`, test files from coverage

### jest.setup.ts
- Imports `@testing-library/jest-dom` for DOM matchers
- Mocks environment variables for tests
- Mocks global `fetch` function
- Clears mocks after each test

## Writing Tests

### Example Test Structure

```typescript
import { myFunction } from '../myModule';

describe('MyModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('myFunction', () => {
    it('should do something correctly', () => {
      const result = myFunction('input');
      expect(result).toBe('expected output');
    });

    it('should handle errors', () => {
      expect(() => myFunction(null)).toThrow('Error message');
    });
  });
});
```

### Testing Async Functions

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toEqual({ success: true });
});
```

### Mocking Fetch

```typescript
(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: 'test' }),
});
```

## Coverage Goals

- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

## Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the function does, not how it does it
   - Test public interfaces, not internal details

2. **Keep Tests Simple**
   - One assertion per test when possible
   - Clear test names that describe what's being tested

3. **Use Descriptive Names**
   ```typescript
   it('should sanitize XSS attacks from user input')
   it('should reject invalid email addresses')
   ```

4. **Test Edge Cases**
   - Empty strings
   - Null/undefined values
   - Very long strings
   - Special characters
   - Invalid inputs

5. **Mock External Dependencies**
   - Database connections
   - API calls
   - File system operations
   - Environment variables

## Common Matchers

```typescript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);

// Strings
expect(value).toContain('substring');
expect(value).toMatch(/pattern/);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('Error message');

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

## Next Steps

### Tests to Add:

1. **API Route Tests**
   - `app/api/donations/create/route.ts`
   - `app/api/merchants/submit/route.ts`
   - `app/api/admin/merchants/route.ts`

2. **Component Tests**
   - `components/Alert.tsx`
   - `components/Loading.tsx`
   - `components/ui/*`

3. **Integration Tests**
   - End-to-end donation flow
   - Merchant submission flow
   - Admin approval workflow

4. **Performance Tests**
   - Database query performance
   - API response times
   - Caching effectiveness

## Troubleshooting

### Tests Not Running
- Check `jest.config.ts` is valid
- Verify all dependencies installed: `npm install`
- Clear Jest cache: `npx jest --clearCache`

### Import Errors
- Check module paths in `jest.config.ts` moduleNameMapper
- Verify `@/` alias is configured correctly

### Mock Not Working
- Ensure mock is defined before import
- Use `jest.clearAllMocks()` in `beforeEach`
- Check mock is properly typed: `(fn as jest.Mock)`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Status**: ✅ Testing framework configured and ready
**Test Files**: 4 comprehensive test suites with 265+ tests
**Coverage**: Run `npm run test:coverage` to see current coverage
