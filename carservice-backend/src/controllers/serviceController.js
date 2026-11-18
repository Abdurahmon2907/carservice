const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper — verify business belongs to logged-in owner
const verifyOwner = async (businessId, ownerId) => {
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business)              throw { status: 404, message: 'Business not found' };
  if (business.ownerId !== ownerId) throw { status: 403, message: 'Not your business' };
  return business;
};

// ─── POST /api/businesses/:id/services ───────────────────
const addService = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.id);
    const ownerId    = req.user.id;

    await verifyOwner(businessId, ownerId);

    const { name, description, price, duration } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'name and price are required' });
    }

    const service = await prisma.service.create({
      data: {
        businessId,
        name,
        description,
        price:    parseFloat(price),
        duration: duration ? parseInt(duration) : null,
      },
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/businesses/:id/services/:serviceId ─────────
const updateService = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.id);
    const serviceId  = parseInt(req.params.serviceId);
    const ownerId    = req.user.id;

    await verifyOwner(businessId, ownerId);

    const { name, description, price, duration, isActive } = req.body;

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: {
        ...(name        !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price       !== undefined && { price: parseFloat(price) }),
        ...(duration    !== undefined && { duration: parseInt(duration) }),
        ...(isActive    !== undefined && { isActive }),
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/businesses/:id/services/:serviceId ──────
const deleteService = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.id);
    const serviceId  = parseInt(req.params.serviceId);
    const ownerId    = req.user.id;

    await verifyOwner(businessId, ownerId);

    // Soft delete — just mark inactive
    await prisma.service.update({
      where: { id: serviceId },
      data:  { isActive: false },
    });

    res.json({ success: true, message: 'Service removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addService, updateService, deleteService };