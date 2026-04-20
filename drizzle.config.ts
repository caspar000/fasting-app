import type { Config } from 'drizzle-kit';

export default {
  schema: './src/data/database/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
