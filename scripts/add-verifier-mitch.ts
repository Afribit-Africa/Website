import { executeQuery } from '../lib/db';
import { randomUUID } from 'crypto';

async function addVerifier() {
  const email = 'mitchjuma44@gmail.com';
  const name = 'Mitch Juma';
  const role = 'verifier';

  try {
    // Check if user exists in admin_users table
    const existingUsers = await executeQuery<any[]>(
      'SELECT * FROM admin_users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log('Existing user found:', existingUsers[0]);
      // Update existing user
      await executeQuery(
        'UPDATE admin_users SET role = ?, is_active = 1, password_hash = ? WHERE email = ?',
        [role, 'GOOGLE_OAUTH', email]
      );
      console.log(`✅ Updated ${email} to ${role} role`);
    } else {
      // Insert new user with Google OAuth
      const userId = randomUUID();
      await executeQuery(
        'INSERT INTO admin_users (id, email, password_hash, name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, email, 'GOOGLE_OAUTH', name, role, 1]
      );
      console.log(`✅ Added ${email} as new ${role}`);
    }

    // Verify the change
    const user = await executeQuery<any[]>(
      'SELECT id, email, name, role, is_active, created_at FROM admin_users WHERE email = ?',
      [email]
    );
    console.log('\n✅ Verifier details:');
    console.log(user[0]);

  } catch (error) {
    console.error('❌ Error adding verifier:', error);
    process.exit(1);
  }
}

addVerifier();
