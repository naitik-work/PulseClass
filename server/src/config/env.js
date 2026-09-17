const dotenv = require('dotenv');
dotenv.config();

const env = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://naitik:pZsi7Vq4YVjtO3f7@cluster0.vftlhyz.mongodb.net/PulseClass?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'pulseclass-super-secret-jwt-development-token-2026',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
  get isProduction() {
    return this.NODE_ENV === 'production';
  },
};

// Warn if using default secret in production
if (env.isProduction && env.JWT_SECRET === 'dev-secret-change-in-production') {
  console.error('FATAL: JWT_SECRET must be set in production');
  process.exit(1);
}

module.exports = env;
