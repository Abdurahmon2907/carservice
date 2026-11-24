const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes       = require('./routes/auth');
const categoryRoutes   = require('./routes/categories');
const businessRoutes   = require('./routes/businesses');
const bookingRoutes    = require('./routes/bookings');
const errorHandler     = require('./middleware/errorHandler');

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(helmet());          // security headers
// CORS_ORIGIN = comma-separated allowed sites (e.g. the Vercel URL); unset = allow all
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true }));
app.use(morgan('dev'));      // request logging
app.use(express.json());    // parse JSON body

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/bookings',   bookingRoutes);

// ─── Health check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'CarService API running 🚗' });
});

// ─── Error handler (must be last) ─────────────────────────
app.use(errorHandler);

module.exports = app;