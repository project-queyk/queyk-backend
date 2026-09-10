import jwt from "jsonwebtoken";
import { config } from "dotenv";

config({ path: ".env.local" });

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "7d") as jwt.SignOptions["expiresIn"];

export interface UserJWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function signUserJWT({
  id,
  email,
  role,
  name,
}: {
  id: string;
  email: string;
  role: string;
  name: string;
}) {
  if (!JWT_SECRET) return null;

  const payload = {
    userId: id,
    email: email,
    role: role,
    name: name,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyUserJWT(token: string) {
  if (!JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as UserJWTPayload;
  } catch {
    return null;
  }
}
