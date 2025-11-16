// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// Mock environment variables for tests
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test_db';
process.env.BTCPAY_HOST = 'https://test.btcpay.com';
process.env.BTCPAY_STORE_ID = 'test_store_id';
process.env.BTCPAY_API_KEY = 'test_api_key';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test_secret';

// Mock fetch globally for tests
global.fetch = jest.fn();

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
