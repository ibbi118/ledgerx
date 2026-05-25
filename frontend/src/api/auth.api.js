import axiosInstance from './axiosInstance';

export const registerUser = async (data) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

/**
 * probeSystemUser — determines if the current token belongs to a system user
 * WITHOUT requiring systemUser in the JWT payload.
 *
 * Strategy: call the system-only endpoint with intentionally bad data.
 *   403 Forbidden  → middleware rejected it  → NOT a system user
 *   400/422/500    → middleware passed it     → IS a system user (bad body, but authorized)
 *   401            → token invalid/expired
 *
 * This is a one-time check run after login/hydration.
 */
export const probeSystemUser = async () => {
  try {
    await axiosInstance.post('/transaction/system/initial-fund', {
      toAccount: '000000000000000000000000', // valid-format but nonexistent
      amount: -1,                            // invalid amount
      idempotencyKey: '__probe__',
    });
    // If it somehow resolves → system user
    return true;
  } catch (err) {
    const status = err.response?.status;
    if (status === 403) return false;  // system middleware blocked it
    if (status === 401) return false;  // not authenticated
    // 400, 404, 422, 500 → got past the system middleware → IS system user
    return true;
  }
};
