const bodyParser = require('body-parser');
const express = require('express');
const { uploadpaid } = require('../config/uploads');
const {
    addAudio,
    getAllAudios,
    updateAudio,
    deleteAudio,
    sendPaidAudioEmail,
    handleCheckOut,
    handleConfirm,
    downloadPaidAudio,
} = require('../controllers/paidAudioController');
const { getPaidAudioReports } = require('../controllers/reportController');

const router = express.Router();

router.post("/", uploadpaid.single("audioFile"), addAudio);

router.get("/", getAllAudios);

router.put("/:id", uploadpaid.single("audioFile"), updateAudio);

router.delete("/:id", deleteAudio);

router.post("/create-checkout-session", handleCheckOut)

router.get('/confirm-payment', handleConfirm )

router.get('/download/:filename', downloadPaidAudio )

router.get('/reports', getPaidAudioReports)





module.exports = router; 