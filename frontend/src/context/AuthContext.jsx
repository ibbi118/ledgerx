import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, probeSystemUser } from '../api/auth.api';
import { TOKEN_KEY, USER_KEY, SYSTEM_USER_EMAIL } from '../constants/config';
import { decodeJWT, isTokenExpired } from '../utils/decodeToken';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

/**
 * resolveSystemUser — determines systemUser through three layers:
 *
 * Layer 0 (instant): email === SYSTEM_USER_EMAIL → always system user
 * Layer 1 (fast):    read `systemUser` from JWT payload (if backend includes it)
 * Layer 2 (network): probe the system endpoint and read the HTTP status code
 */
const resolveSystemUser = async (token, cachedUser) => {
  // ── Layer 0: Known system email (instant, no network) ────────────────────
  const email = cachedUser?.email || decodeJWT(token)?.email;
  if (email && email.toLowerCase() === SYSTEM_USER_EMAIL.toLowerCase()) {
    return true;
  }

  // ── Layer 1: JWT payload ──────────────────────────────────────────────────
  const payload = decodeJWT(token);
  if (payload && 'systemUser' in payload) {
    return Boolean(payload.systemUser);
  }

  // ── Layer 2: Cached value (skip network round-trip) ───────────────────────
  if (typeof cachedUser?.systemUser === 'boolean') {
    return cachedUser.systemUser;
  }

  // ── Layer 3: Probe request ────────────────────────────────────────────────
  return await probeSystemUser();
};

/**
 * buildUserObject — merges API response user with JWT payload fields.
 * systemUser is intentionally left out here; it's resolved async via
 * resolveSystemUser() and patched in afterwards.
 */
const buildBaseUser = (responseUser, token) => {
  const payload = decodeJWT(token);
  return {
    ...responseUser,
    ...(payload ? {
      _id:      payload._id      ?? payload.id ?? responseUser._id,
      email:    payload.email    ?? responseUser.email,
      username: payload.username ?? responseUser.username,
    } : {}),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Hydrate from localStorage on mount ────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser  = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        try {
          if (isTokenExpired(storedToken)) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          } else {
            const parsed  = JSON.parse(storedUser);
            const base    = buildBaseUser(parsed, storedToken);

            // Resolve systemUser (uses cached value if already known)
            const isSystem = await resolveSystemUser(storedToken, parsed);
            const fullUser = { ...base, systemUser: isSystem };

            setToken(storedToken);
            setUser(fullUser);
            localStorage.setItem(USER_KEY, JSON.stringify(fullUser));
          }
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  // ─── Persist + resolve systemUser ──────────────────────────────────────
  const persist = async (responseUser, jwtToken) => {
    const base     = buildBaseUser(responseUser, jwtToken);
    // On fresh login: never use cache — always resolve fresh
    const isSystem = await resolveSystemUser(jwtToken, null);
    const fullUser = { ...base, systemUser: isSystem };

    localStorage.setItem(TOKEN_KEY, jwtToken);
    localStorage.setItem(USER_KEY,  JSON.stringify(fullUser));
    setToken(jwtToken);
    setUser(fullUser);

    return fullUser;
  };

  // ─── Login ──────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const data     = await loginUser(credentials);
    const fullUser = await persist(data.user, data.token);
    return { ...data, user: fullUser };
  }, []);

  // ─── Register ───────────────────────────────────────────────────────────
  const register = useCallback(async (credentials) => {
    const data     = await registerUser(credentials);
    const fullUser = await persist(data.user, data.token);
    return { ...data, user: fullUser };
  }, []);

  // ─── Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setToken(null);
      toast.success('Logged out successfully');
    }
  }, []);

  /**
   * refreshSystemRole — call this if you suspect the DB was updated
   * while the user is already logged in (no re-login needed).
   * Re-runs the probe and patches state + localStorage.
   */
  const refreshSystemRole = useCallback(async () => {
    if (!token) return;
    const isSystem = await probeSystemUser();
    setUser((prev) => {
      const updated = { ...prev, systemUser: isSystem };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
    toast.success(isSystem ? 'System role activated!' : 'Standard user role confirmed.');
  }, [token]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated:  !!user && !!token,
    isSystemUser:     user?.systemUser === true,
    login,
    register,
    logout,
    refreshSystemRole,   // ← expose for manual refresh
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
