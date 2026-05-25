import axiosInstance from './axiosInstance';

/**
 * Create a new account for the logged-in user
 */
export const createAccount = async () => {
  const response = await axiosInstance.post('/account/');
  return response.data;
};

/**
 * Get all accounts for the logged-in user
 */
export const getAccounts = async () => {
  const response = await axiosInstance.get('/account/get');
  return response.data;
};

/**
 * Get balance for a specific account
 * @param {string} accountId
 */
export const getBalance = async (accountId) => {
  const response = await axiosInstance.get(`/account/balance/${accountId}`);
  return response.data;
};
