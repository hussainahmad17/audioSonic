// Migration script: Upload local audio files to Cloudinary and update MongoDB records
// Usage: node backend/scripts/migrate-to-cloudinary.js
// Requires env: MONGO_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const { uploadAudioBuffer } = require('../src/config/cloudinary');
const FreeAudio = require('../src/models/FreeAudio');
const PaidAudio = require('../src/models/PaidAudio');

function isHttpUrl(str) {
  return typeof str === 'string' && /^https?:\/\//i.test(str);
}

async function uploadLocalFile(localPath, originalName) {
  const buffer = fs.readFileSync(localPath);
  const ext = path.extname(originalName || localPath);
  const filename = `${Date.now()}${ext}`;
  const mimeType = ext.toLowerCase() === '.wav' ? 'audio/wav' : 'audio/mpeg';
  return uploadAudioBuffer(buffer, filename, mimeType);
}

async function migrateCollection(Model, uploadsSubfolder) {
  const docs = await Model.find({});
  let updated = 0;
  let skipped = 0;
  for (const doc of docs) {
    try {
      const file = doc.audioFile;
      if (isHttpUrl(file)) { skipped++; continue; }
      const localPath = path.join(__dirname, '..', 'uploads', uploadsSubfolder, String(file));
      if (!fs.existsSync(localPath)) {
        console.warn(`[skip] Local file missing: ${localPath} (id=${doc._id})`);
        skipped++; continue;
      }
      const result = await uploadLocalFile(localPath, file);
      doc.audioFile = result.url;
      if (!doc.duration && result.duration) {
        doc.duration = Math.round(result.duration);
      }
      await doc.save();
      updated++;
      console.log(`[ok] ${Model.modelName} ${doc._id} -> ${result.url}`);
    } catch (err) {
      console.error(`[error] ${Model.modelName} ${doc._id}:`, err.message);
    }
  }
  console.log(`Migrated ${Model.modelName}: updated=${updated}, skipped=${skipped}`);
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is required');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
  await migrateCollection(FreeAudio, 'free-audio');
  await migrateCollection(PaidAudio, 'paid-audio');
  await mongoose.disconnect();
  console.log('Migration completed');
}

main().catch((e) => { console.error(e); process.exit(1); });
