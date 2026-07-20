import Admin, { AdminHelper } from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

export const seedAdmin = async () => {
  let email = (process.env.ADMIN_EMAIL || 'pratibha123@gmail.com').toLowerCase();
  if (!email.includes('@')) {
    email += '@gmail.com';
  }
  const password = process.env.ADMIN_PASSWORD || 'Pratibha@123#';

  try {
    const existingAdmin = await Admin.findOne({ email });

    const hashedPassword = await AdminHelper.hashPassword(password);

    if (existingAdmin) {
      console.log(`[Seed] Admin account "${email}" already exists. Skipping creation.`);
    } else {
      await Admin.create({
        email,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`[Seed] Admin account "${email}" created.`);
    }
  } catch (err: any) {
    console.error('[Seed] CRITICAL: Failed to seed admin:', err.message);
  }
};
