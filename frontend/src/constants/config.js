// API base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Local storage keys
export const TOKEN_KEY = 'ledgerx_token';
export const USER_KEY = 'ledgerx_user';

// System user email — this account always gets system operator access
export const SYSTEM_USER_EMAIL = 'ledgersystem@gmail.com';

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REVERSED: 'REVERSED',
};

// Account statuses
export const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN',
  CLOSED: 'CLOSED',
};

// Status color map
export const STATUS_COLORS = {
  PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  FAILED: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  REVERSED: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  ACTIVE: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  FROZEN: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  CLOSED: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
};
