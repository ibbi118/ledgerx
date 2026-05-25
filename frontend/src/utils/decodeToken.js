/**
 * decodeJWT — decodes the payload of a JWT token WITHOUT verifying the signature.
 * Signature verification happens server-side. This is only for reading claims
 * like `systemUser`, `email`, `username` on the frontend.
 *
 * JWT structure:  header.payload.signature
 * The payload is base64url-encoded JSON.
 *
 * @param {string} token - JWT string
 * @returns {object|null} - decoded payload, or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);

    return JSON.parse(json);
  } catch {
    return null;
  }
};

/**
 * isTokenExpired — checks whether a JWT has passed its `exp` claim.
 * @param {string} token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload?.exp) return false; // no expiry = treat as valid
  return Date.now() / 1000 > payload.exp;
};
