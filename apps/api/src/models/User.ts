import bcrypt from 'bcryptjs';
import { PlatformUser } from "@enterprise-commerce/core/platform/types";
import openDb from '../db/db';

export const createUser = async (user: PlatformUser): Promise<PlatformUser> => {
  const db = await openDb();

  const hashedPassword = await bcrypt.hash(user.password!, 10);

  const result = await db.run(
    'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)',
    user.email,
    hashedPassword,
    null,
    null
  );

  const createdUser = await db.get<PlatformUser>(
    'SELECT * FROM users WHERE id = ?',
    result.lastID
  );

  await db.close();

  return createdUser as PlatformUser;
};

export const findUserById = async (id: string): Promise<PlatformUser | null> => {
  const db = await openDb();
  const user = await db.get<PlatformUser>('SELECT * FROM users WHERE id = ?', id);
  await db.close();
  return user || null;
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};