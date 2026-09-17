const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

const envSchema = z.object({
  MONGODB_URI: z
    .string({
      required_error: 'MONGODB_URI is required. Please set MONGODB_URI in your server/.env file.',
    })
    .min(1, 'MONGODB_URI cannot be empty')
    .default(isTestEnv ? 'mongodb://127.0.0.1:27017/pulseclass_test' : undefined),
  JWT_SECRET: z
    .string({
      required_error: 'JWT_SECRET is required. Please set JWT_SECRET in your server/.env file.',
    })
    .min(1, 'JWT_SECRET cannot be empty')
    .default(isTestEnv ? 'test-jwt-secret-placeholder-for-unit-tests-only' : undefined),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n========================================');
  console.error('FATAL: Environment configuration validation error:');
  parsed.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join('.') || 'configuration'}: ${issue.message}`);
  });
  console.error('See server/.env.example for required variables.');
  console.error('========================================\n');
  process.exit(1);
}

const env = {
  ...parsed.data,
  get isProduction() {
    return this.NODE_ENV === 'production';
  },
};

// Enforce strong JWT_SECRET in production
if (env.isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  console.error('FATAL: A secure, unique JWT_SECRET (at least 32 characters) must be set in production.');
  process.exit(1);
}

module.exports = env;
