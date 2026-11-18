const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const role   = require('../middleware/roleMiddleware');

const {
  createBooking,
  updateBookingStatus,
  getMyBookings,
} = require('../controllers/bookingController');

router.post('/',                auth,                          createBooking);
router.get('/my',               auth,                          getMyBookings);
router.put('/:id/status',       auth, role('BUSINESS_OWNER'), updateBookingStatus);

module.exports = router;