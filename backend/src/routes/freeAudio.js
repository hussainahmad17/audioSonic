const express = require('express');
const { upload } = require('../config/uploads');
const { 
    addAudio, 
    getAllAudios, 
    updateAudio, 
    deleteAudio, 
    sendAudioEmail,
    downloadAudios,
} = require('../controllers/freeAudioController');
const { getFreeAudioReports } = require('../controllers/reportController');
const router = express.Router();

router.post("/", upload.single("audioFile"), addAudio);

router.get("/", getAllAudios);

router.put("/:id", upload.single("audioFile"), updateAudio);

router.delete("/:id", deleteAudio);

router.post("/send-free-audio", sendAudioEmail)

router.post("/download/:filename", downloadAudios)

router.get("/reports", getFreeAudioReports)



module.exports = router;