import jwt from "jsonwebtoken";

export const decodeToken = (token: string) => {
  try {
    const decoded = jwt.decode(token) as { role: string; email: string };
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getUserRole = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};
