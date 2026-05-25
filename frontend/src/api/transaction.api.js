import axiosInstance from './axiosInstance';

/**
 * Create a new transaction between two accounts
 * @param {{ fromAccount: string, toAccount: string, amount: number, idempotencyKey: string }} data
 */
export const createTransaction = async (data) => {
  const response = await axiosInstance.post('/transaction/', data);
  return response.data;
};

/**
 * System-only: Fund an account with initial balance
 * @param {{ toAccount: string, amount: number, idempotencyKey: string }} data
 */
export const systemInitialFund = async (data) => {
  const response = await axiosInstance.post('/transaction/system/initial-fund', data);
  return response.data;
};

/**
 * Get all transactions for the logged-in user
 */
export const getTransactions = async () => {
  const response = await axiosInstance.get('/transaction/get');
  return response.data;
};
