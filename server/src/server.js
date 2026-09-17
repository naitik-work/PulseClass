const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initializeSocket } = require('./socket/socketHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const instituteRoutes = require('./routes/institute.routes');
const classroomRoutes = require('./routes/classroom.routes');
const sessionRoutes = require('./routes/session.routes');
const pulseRoutes = require('./routes/pulse.routes');

const app = express();
const server = http.createServer(app);

// Trust reverse proxy in production (Render, Cloudflare, etc.) for secure cookies and accurate rate limiting
if (env.isProduction) {
  app.set('trust proxy', 1);
}

// Normalize allowed CORS origins (handles comma-separated origins, trims trailing slashes)
const allowedOrigins = (env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (health checks, curl, tools)
  const normalized = origin.trim().replace(/\/+$/, '');
  if (allowedOrigins.includes(normalized)) return true;
  if (!env.isProduction && (normalized.includes('localhost') || normalized.includes('127.0.0.1'))) {
    return true;
  }
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    }
  },
  credentials: true,
};

// Socket.io setup
const io = new Server(server, {
  cors: corsOptions,
});

// --- Middleware ---

// Security headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again later' },
});

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// --- Routes ---

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/institutes', apiLimiter, instituteRoutes);
app.use('/api/classrooms', apiLimiter, classroomRoutes);
app.use('/api/sessions', apiLimiter, sessionRoutes);
app.use('/api/pulses', apiLimiter, pulseRoutes);

// Institute classrooms route (nested under institutes)
const authenticate = require('./middleware/authenticate');
const { getInstituteClassrooms } = require('./controllers/classroom.controller');
const { getClassroomSessions } = require('./controllers/session.controller');
app.get('/api/institutes/:id/classrooms', apiLimiter, authenticate, getInstituteClassrooms);
app.get('/api/classrooms/:id/sessions', apiLimiter, authenticate, getClassroomSessions);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// --- Initialize Socket.io ---
initializeSocket(io);

// --- Start Server ---
async function startServer() {
  await connectDB();

  server.listen(env.PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════╗
║         PulseClass Server               ║
║         Port: ${String(env.PORT).padEnd(26)}║
║         Env:  ${env.NODE_ENV.padEnd(26)}║
╚══════════════════════════════════════════╝
    `);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, server, io, startServer };
