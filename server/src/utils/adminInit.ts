import { User } from '../models/User';
import { env } from '../config/env';

/**
 * Production-ready lean initializer: Ensures an admin account exists
 * without loading or running mock/seed data in production.
 */
export const ensureAdminUser = async (): Promise<void> => {
  try {
    const adminExists = await User.exists({ role: 'admin' });
    if (!adminExists) {
      const email = env.ADMIN_EMAIL || 'admin@hydra.com';
      const password = env.ADMIN_PASSWORD || 'Admin@Hydra2026';

      await User.create({
        name: 'Hydra Administrator',
        email,
        password,
        role: 'admin',
        phone: '+91 98765 43210',
      });
      console.log(`🌿 [Auth Init] Admin account verified & ready: ${email}`);
    }
  } catch (error) {
    console.error('⚠️ [Auth Init] Admin verification check notice:', error);
  }
};
