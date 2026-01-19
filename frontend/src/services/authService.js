
import { v4 as uuid } from "uuid";
import { LS_KEYS } from "../utils/constants";
import { getLS, setLS } from "../utils/helpers";

/**
 * Simple hash function using SHA-256 (browser native)
 * Note: For production, use bcrypt on a real backend!
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "TCS_SALT_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Synchronous hash for quick validation (simplified)
 * Uses simple string manipulation - adequate for localStorage demo
 */
function simpleHash(password) {
  let hash = 0;
  const salt = "TCS_2024_SECURE";
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + str.length.toString(36);
}

export function registerUser({ name, email, password }) {
  try {
    const users = getLS(LS_KEYS.USERS, []);
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("Email already registered.");

    // Basic validation
    if (!name || name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters.");
    }
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const hashedPassword = simpleHash(password);
    const user = {
      id: uuid(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "student",
      createdAt: new Date().toISOString()
    };

    setLS(LS_KEYS.USERS, [...users, user]);
    return { ...user, password: undefined }; // Don't return password
  } catch (error) {
    throw error;
  }
}

export function loginUser({ email, password }) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const users = getLS(LS_KEYS.USERS, []);
    const hashedPassword = simpleHash(password);

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() &&
        (u.password === hashedPassword || u.password === password) // Support both hashed and legacy
    );

    if (!user) throw new Error("Invalid email or password.");

    // 30 min session (extended from 15)
    const session = {
      userId: user.id,
      role: user.role,
      expiresAt: Date.now() + 30 * 60 * 1000,
      loginAt: Date.now()
    };

    setLS(LS_KEYS.SESSION, session);
    return {
      user: { ...user, password: undefined },
      session
    };
  } catch (error) {
    throw error;
  }
}

export function logoutUser() {
  try {
    localStorage.removeItem(LS_KEYS.SESSION);
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export function getSessionUser() {
  try {
    const session = getLS(LS_KEYS.SESSION, null);
    if (!session) return null;

    // Auto-expire session
    if (session.expiresAt && Date.now() > session.expiresAt) {
      logoutUser();
      return null;
    }

    const users = getLS(LS_KEYS.USERS, []);
    const user = users.find(u => u.id === session.userId);

    if (!user) {
      logoutUser();
      return null;
    }

    return { ...user, password: undefined };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export function refreshSession(minutes = 30) {
  try {
    const session = getLS(LS_KEYS.SESSION, null);
    if (!session) return false;

    setLS(LS_KEYS.SESSION, {
      ...session,
      expiresAt: Date.now() + minutes * 60 * 1000
    });
    return true;
  } catch (error) {
    console.error("Refresh session error:", error);
    return false;
  }
}

/**
 * Check if current session is valid
 */
export function isSessionValid() {
  const session = getLS(LS_KEYS.SESSION, null);
  if (!session) return false;
  return session.expiresAt && Date.now() < session.expiresAt;
}

/**
 * Get remaining session time in minutes
 */
export function getSessionTimeRemaining() {
  const session = getLS(LS_KEYS.SESSION, null);
  if (!session || !session.expiresAt) return 0;
  const remaining = session.expiresAt - Date.now();
  return Math.max(0, Math.ceil(remaining / 60000));
}
