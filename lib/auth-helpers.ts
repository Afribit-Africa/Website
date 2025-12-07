import bcrypt from 'bcryptjs';
import { executeQuery } from './db';
import { randomUUID } from 'crypto';

interface CreateAdminUserParams {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'super_admin' | 'reviewer';
}

export async function createAdminUser({
  email,
  password,
  name,
  role = 'admin',
}: CreateAdminUserParams): Promise<{ id: string; email: string }> {
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Generate UUID
  const id = randomUUID();

  // Insert into database
  await executeQuery(
    `INSERT INTO admin_users (id, email, password_hash, name, role)
     VALUES (?, ?, ?, ?, ?)`,
    [id, email, passwordHash, name, role]
  );

  return { id, email };
}

export async function updateAdminPassword(
  email: string,
  newPassword: string
): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await executeQuery(
    'UPDATE admin_users SET password_hash = ?, updated_at = NOW() WHERE email = ?',
    [passwordHash, email]
  );
}

interface AdminPasswordRow {
  password_hash: string;
}

export async function verifyAdminPassword(
  email: string,
  password: string
): Promise<boolean> {
  const users = await executeQuery<AdminPasswordRow[]>(
    'SELECT password_hash FROM admin_users WHERE email = ? AND is_active = true',
    [email]
  );

  if (!users || users.length === 0) {
    return false;
  }

  return bcrypt.compare(password, users[0].password_hash);
}
