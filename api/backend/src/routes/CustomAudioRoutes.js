const express = require('express');
const { createCheckoutSession, sendAdminNotification, confirmPayment, createCustomAudioRequest, updateCustomAudioRequest, getCustomAudioRequests } = require('../controllers/customAudioController');
const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/confirm-payment', confirmPayment);
router.post('/', createCustomAudioRequest);
router.put('/:id', updateCustomAudioRequest);
router.get('/', getCustomAudioRequests);

module.exports = router;
