/**
 * Generate a unique idempotency key for transactions.
 * Combines timestamp + random hex to ensure uniqueness.
 * @returns {string}
 */
export const generateIdempotencyKey = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `lx-${timestamp}-${randomPart}`;
};
