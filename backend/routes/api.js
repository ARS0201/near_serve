const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const serviceController = require('../controllers/serviceController');
const bookingController = require('../controllers/bookingController');
const notificationController = require('../controllers/notificationController');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

// 1. Authentication APIs (Phase 15)
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/users/profile', authMiddleware, authController.getProfile);
router.put('/users/profile', authMiddleware, authController.updateProfile);

// 2. Service & Provider APIs (Phase 16)
router.get('/categories', serviceController.getCategories);
router.get('/services', serviceController.getServices);
router.get('/services/search', serviceController.searchServices);
router.get('/services/filter', serviceController.filterServices);
router.get('/services/:id', serviceController.getServiceById);

router.get('/providers', serviceController.getServices);
router.get('/providers/:id', serviceController.getServiceById);

// 3. Booking APIs (Phase 17)
router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.cancelBooking);

// 4. Review APIs (Phase 18)
router.post('/reviews', reviewController.addReview);
router.get('/services/:id/reviews', reviewController.getServiceReviews);

// 5. Notification APIs (Phase 19)
router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);

module.exports = router;
