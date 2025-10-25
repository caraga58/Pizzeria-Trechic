// A simple hashing service using the browser's built-in crypto API.
// This avoids needing to bundle a large crypto library.

/**
 * Hashes a password using SHA-256.
 * @param password The plain-text password.
 * @returns A promise that resolves to the hex-encoded hash.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Verifies a password against a stored hash.
 * @param password The plain-text password to check.
 * @param storedHash The hex-encoded hash from storage.
 * @returns A promise that resolves to true if the password is correct, false otherwise.
 */
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const newHash = await hashPassword(password);
  return newHash === storedHash;
};
