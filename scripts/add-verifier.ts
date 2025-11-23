import { config } from 'dotenv';
import { resolve } from 'path';
import { executeQuery } from '../lib/db';
import * as bcrypt from 'bcryptjs';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function addVerifier() {
  const email = 'goldenheartcbo@gmail.com';
  const password = 'Afribit2024!'; // Temporary password - user should change this
  const name = 'Golden Heart CBO';
  const role = 'verifier'; // Role: verifier (not admin)

  try {
    // Check if user already exists
    const existing = await executeQuery(
      'SELECT id, role FROM admin_users WHERE email = ?',
      [email]
    ) as any[];

    if (existing && existing.length > 0) {
      console.log('✅ User already exists:', email);
      console.log('   Current role:', existing[0].role);

      // Update role to verifier if needed
      if (existing[0].role !== 'verifier') {
        await executeQuery(
          'UPDATE admin_users SET role = ?, updated_at = NOW() WHERE email = ?',
          ['verifier', email]
        );
        console.log('✅ Role updated to verifier');
      }
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert verifier into admin_users table
    await executeQuery(
      `INSERT INTO admin_users (id, email, password_hash, name, role, is_active, created_at)
       VALUES (UUID(), ?, ?, ?, ?, 1, NOW())`,
      [email, passwordHash, name, role]
    );

    console.log('✅ Verifier added successfully!');
    console.log('Email:', email);
    console.log('Role:', role);
    console.log('Temporary Password:', password);
    console.log('⚠️  User should change password after first login');
  } catch (error: any) {
    console.error('❌ Error adding verifier:', error.message);
    throw error;
  }

  process.exit(0);
}

addVerifier();
