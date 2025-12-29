const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ---------- Free Audio Upload Config ---------- */

// Use in-memory storage for Vercel/serverless compatibility
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid audio format"), false);
  }
};

const upload = multer({ storage, fileFilter });

/* ---------- Paid Audio Upload Config ---------- */
const storagepaid = multer.memoryStorage();

const fileFilterpaid = (req, file, cb) => {
  const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid audio format"), false);
  }
};

const uploadpaid = multer({ storage: storagepaid, fileFilter: fileFilterpaid });

/* ---------- Export Both ---------- */
module.exports = {
  upload,
  uploadpaid,
};
