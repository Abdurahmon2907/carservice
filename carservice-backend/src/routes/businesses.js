const router  = require('express').Router();
const auth    = require('../middleware/authMiddleware');
const role    = require('../middleware/roleMiddleware');

const {
  registerBusiness,
  getBusinessById,
  updateBusiness,
  getBusinessesNearby,
  getBusinessBookings,
} = require('../controllers/businessController');

const {
  addService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

// Public
router.get('/nearby',                      getBusinessesNearby);
router.get('/:id',                         getBusinessById);

// Business owner only
router.post('/',                           auth, role('BUSINESS_OWNER'), registerBusiness);
router.put('/:id',                         auth, role('BUSINESS_OWNER'), updateBusiness);
router.get('/:id/bookings',               auth, role('BUSINESS_OWNER'), getBusinessBookings);

// Services (owner only)
router.post('/:id/services',              auth, role('BUSINESS_OWNER'), addService);
router.put('/:id/services/:serviceId',    auth, role('BUSINESS_OWNER'), updateService);
router.delete('/:id/services/:serviceId', auth, role('BUSINESS_OWNER'), deleteService);

module.exports = router;