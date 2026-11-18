const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── POST /api/businesses ─────────────────────────────────
// Register a new business (owner only)
const registerBusiness = async (req, res, next) => {
  try {
    const {
      name,
      description,
      phone,
      address,
      latitude,
      longitude,
      categoryId,
      workingHours,
    } = req.body;

    const ownerId = req.user.id;

    if (!name || !address || !latitude || !longitude || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'name, address, latitude, longitude, categoryId are required',
      });
    }

    // Check category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { id: parseInt(categoryId) },
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const business = await prisma.business.create({
      data: {
        ownerId,
        name,
        description,
        phone,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        categoryId: parseInt(categoryId),
        workingHours: workingHours || null,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, data: business });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/businesses/:id ──────────────────────────────
// Get business profile (public)
const getBusinessById = async (req, res, next) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true,
        services: { where: { isActive: true } },
        owner: { select: { id: true, firstName: true, phone: true } },
      },
    });

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    res.json({ success: true, data: business });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/businesses/:id ──────────────────────────────
// Update business info (owner only)
const updateBusiness = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.id);
    const ownerId = req.user.id;

    // Make sure this business belongs to the logged-in owner
    const existing = await prisma.business.findUnique({ where: { id: businessId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    if (existing.ownerId !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not your business' });
    }

    const {
      name,
      description,
      phone,
      address,
      latitude,
      longitude,
      workingHours,
      isActive,
    } = req.body;

    const updated = await prisma.business.update({
      where: { id: businessId },
      data: {
        ...(name        && { name }),
        ...(description && { description }),
        ...(phone       && { phone }),
        ...(address     && { address }),
        ...(latitude    && { latitude: parseFloat(latitude) }),
        ...(longitude   && { longitude: parseFloat(longitude) }),
        ...(workingHours !== undefined && { workingHours }),
        ...(isActive    !== undefined && { isActive }),
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/businesses/nearby ───────────────────────────
// Get businesses near a location (public)
const getBusinessesNearby = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5, categoryId } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat and lng are required' });
    }

    const userLat  = parseFloat(lat);
    const userLng  = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    const where = { isActive: true };
    if (categoryId) where.categoryId = parseInt(categoryId);

    const businesses = await prisma.business.findMany({
      where,
      include: {
        category: true,
        services: { where: { isActive: true }, take: 5 },
      },
    });

    const withDistance = businesses
      .map((b) => ({
        ...b,
        distanceKm: parseFloat(haversine(userLat, userLng, b.latitude, b.longitude).toFixed(2)),
      }))
      .filter((b) => b.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ success: true, count: withDistance.length, data: withDistance });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/businesses/:id/bookings ─────────────────────
// Owner sees all bookings for their business
const getBusinessBookings = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.id);
    const ownerId    = req.user.id;

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    if (business.ownerId !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not your business' });
    }

    const bookings = await prisma.booking.findMany({
      where: { businessId },
      include: {
        user:    { select: { id: true, firstName: true, phone: true } },
        service: { select: { id: true, name: true, price: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// ─── Haversine helper ─────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = {
  registerBusiness,
  getBusinessById,
  updateBusiness,
  getBusinessesNearby,
  getBusinessBookings,
};