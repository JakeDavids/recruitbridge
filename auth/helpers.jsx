/**
 * Auth helper utilities for Base44 apps
 * These work with Base44's built-in authentication system
 */

import { User } from "@/api/entities";

/**
 * Check if user is currently authenticated
 * Returns user object if logged in, null otherwise
 */
export async function getCurrentUser() {
  try {
    const user = await User.me();
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user is authenticated (boolean check)
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Redirect to login (triggers Base44 OAuth flow)
 */
export async function redirectToLogin() {
  try {
    await User.login();
  } catch (error) {
    console.error("Login redirect error:", error);
  }
}

/**
 * Logout current user
 */
export async function logout() {
  try {
    await User.logout();
  } catch (error) {
    console.error("Logout error:", error);
  }
}