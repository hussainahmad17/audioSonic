const express = require('express');
const { createCheckoutSession, confirmPayment } = require('../controllers/customAudioController');
const { getCustomAudioReports } = require('../controllers/reportController');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);

router.post('/confirm-payment', confirmPayment);

router.get('/reports', getCustomAudioReports);



module.exports = router; 