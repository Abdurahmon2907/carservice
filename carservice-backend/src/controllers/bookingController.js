const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── POST /api/bookings ───────────────────────────────────
// User creates a booking
const createBooking = async (req, res, next) => {
  try {
    const { businessId, serviceId, scheduledAt, notes } = req.body;
    const userId = req.user.id;

    if (!businessId || !serviceId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'businessId, serviceId, scheduledAt are required',
      });
    }

    const service = await prisma.service.findFirst({
      where: { id: parseInt(serviceId), businessId: parseInt(businessId), isActive: true },
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        businessId: parseInt(businessId),
        serviceId:  parseInt(serviceId),
        scheduledAt: new Date(scheduledAt),
        totalPrice:  service.price,
        notes,
      },
      include: {
        service:  true,
        business: { select: { name: true, address: true } },
      },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/bookings/:id/status ────────────────────────
// Owner updates booking status
const updateBookingStatus = async (req, res, next) => {
  try {
    const bookingId = parseInt(req.params.id);
    const ownerId   = req.user.id;
    const { status } = req.body;

    const allowed = ['CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${allowed.join(', ')}`,
      });
    }

    // Make sure booking belongs to owner's business
    const booking = await prisma.booking.findUnique({
      where:   { id: bookingId },
      include: { business: true },
    });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.business.ownerId !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not your booking' });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data:  { status },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/bookings/my ─────────────────────────────────
// User sees their own bookings
const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where:   { userId },
      include: {
        service:  { select: { name: true, price: true } },
        business: { select: { name: true, address: true } },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, updateBookingStatus, getMyBookings };