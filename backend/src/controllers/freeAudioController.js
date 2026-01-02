const FreeAudio = require("../models/FreeAudio");
const nodemailer = require('nodemailer');
const FreeAudioDownload = require('../models/FreeAudioDownload');
const path = require("path");
const fs = require("fs");
const { uploadAudioBuffer } = require("../config/cloudinary");
const mm = require('music-metadata');
require("dotenv").config();

const addAudio = async (req, res) => {
    const { title, description, rating, categoryId, subCategoryId, language, voice } = req.body;
    const audioFile = req.file ? req.file.originalname : null;
    // Check for all required fields
    const requiredFields = ['title', 'description', 'rating', 'categoryId', 'subCategoryId', 'language', 'voice'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0 || !audioFile) {
        return res.status(400).json({
            message: `Missing required fields: ${[...missingFields, ...(!audioFile ? ['audioFile'] : [])].join(', ')}`
        });
    }

    try {
        let duration = 0;
        let uploadedUrl = null;

        if (req.file && req.file.buffer) {
            // Compute duration from buffer via music-metadata
            try {
                const metadata = await mm.parseBuffer(req.file.buffer, { mimeType: req.file.mimetype });
                duration = Math.round(metadata.format.duration || 0);
            } catch (err) {
                console.error("Duration extraction error:", err);
                duration = 0;
            }

            // Upload to Cloudinary and get URL
            try {
                const filename = `${Date.now()}${path.extname(req.file.originalname)}`;
                const result = await uploadAudioBuffer(req.file.buffer, filename, req.file.mimetype);
                uploadedUrl = result.url;
                // Use Cloudinary duration if available
                if (!duration && result.duration) {
                    duration = Math.round(result.duration);
                }
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({ message: "Failed to upload audio" });
            }
        }


        const newAudio = await FreeAudio.create({
            title,
            description,
            rating: parseFloat(rating),
            categoryId,
            subCategoryId,
            audioFile: uploadedUrl || audioFile,
            language,
            voice,
            duration: duration // Add duration to model
        });


        return res.status(201).json({
            message: "Audio uploaded successfully",
            audio: newAudio
        });
    } catch (error) {
        console.error("Error handling free audio post:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const getAllAudios = async (req, res) => {
    try {
        const audios = await FreeAudio.find()
            .populate("categoryId", "categoryName")
            .populate("subCategoryId", "Name") // Add this line
            .sort({ createdAt: -1 });

                // Use backend origin (protocol + host) so generated media URLs point to the server
                const origin = `${req.protocol}://${req.get('host')}`;
                const audiosWithUrl = audios.map(audio => ({
                        ...audio.toObject(),
                        audioUrl: (audio.audioFile && /^https?:\/\//i.test(audio.audioFile))
                            ? audio.audioFile
                            : `${origin}/uploads/free-audio/${audio.audioFile}`,
                        duration: audio.duration
                }));

        return res.status(200).json({ success: true, data: audiosWithUrl });
    } catch (error) {
        console.error("Error fetching free audios:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateAudio = async (req, res) => {
    const { id } = req.params;
    const { title, description, rating, categoryId, subCategoryId, language, voice } = req.body;
    const audioFile = req.file ? req.file.originalname : null;

    try {
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (rating) updateData.rating = parseFloat(rating);
        if (categoryId) updateData.categoryId = categoryId;
        if (subCategoryId) updateData.subCategoryId = subCategoryId;
        if (language) updateData.language = language;
        if (voice) updateData.voice = voice;
        if (req.file && req.file.buffer) {
            try {
                const filename = `${Date.now()}${path.extname(req.file.originalname)}`;
                const result = await uploadAudioBuffer(req.file.buffer, filename, req.file.mimetype);
                updateData.audioFile = result.url;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({ message: "Failed to upload audio" });
            }
        }

        const updatedAudio = await FreeAudio.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate("categoryId", "categoryName").populate("subCategoryId", "Name");

        if (!updatedAudio) {
            return res.status(404).json({ message: "Audio not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Audio updated successfully",
            data: updatedAudio // Changed from "audio" to "data"
        });
    } catch (error) {
        console.error("Error updating free audio:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteAudio = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAudio = await FreeAudio.findByIdAndDelete(id);

        if (!deletedAudio) {
            return res.status(404).json({ message: "Audio not found" });
        }

        return res.status(200).json({ message: "Audio deleted successfully" });
    } catch (error) {
        console.error("Error deleting free audio:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const sendAudioEmail = async (req, res) => {
    const { email, audioTitle, audioDescription, audioUrl } = req.body;

    // Input validation
    if (!email || !audioUrl || !audioTitle) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: email, audioUrl, or audioTitle."
        });
    }

    try {
        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

                // Build direct link using backend origin so email links reference the server
                const origin = `${req.protocol}://${req.get('host')}`;
                const directLink = (audioUrl && /^https?:\/\//i.test(audioUrl))
                    ? audioUrl
                    : `${origin}/uploads/free-audio/${audioUrl}`;

        const htmlContent = `
<div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
    <h2 style="color: #2c3e50; margin-bottom: 10px;">🎧 ${audioTitle}</h2>
    <p style="margin-bottom: 15px;">${audioDescription || "Enjoy your free audio file from our collection!"}</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p>Click the button below to <strong>download</strong> your audio:</p>
    <p>
            <a href="${directLink}" 
         style="background-color: #28a745; color: #ffffff; padding: 10px 16px; 
                text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                    🎵 Open Audio
      </a>
    </p>
    <p style="color: #777; font-size: 14px;">If the button doesn’t work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; font-size: 14px;">
            <a href="${directLink}" style="color: #0066cc;">${directLink}</a>
    </p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p style="font-size: 14px; color: #777;">Thank you for using our service! We hope you enjoy your audio experience.</p>
  </div>
</div>
`;

        // Mail options
        const mailOptions = {
            from: `"Free Audio Service" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Your Free Audio: ${audioTitle}`,
            html: htmlContent,
            attachments: [
                {
                    filename: `${audioTitle}.mp3`,
                    path: directLink,
                    contentType: "audio/mpeg"
                }
            ]
        };

        // first make a record then send email
        await FreeAudioDownload.create({
            email,
            audioId: req.body.audioId, // or however you get the audio ID
            date: new Date()
        });

        // Send the email
        await transporter.sendMail(mailOptions);



        return res.status(200).json({
            success: true,
            message: "Email sent successfully."
        });
    } catch (error) {
        console.error('❌ Email send error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to send email. Please try again later."
        });
    }
};

// Deprecated: files are stored remotely; provide direct URL
const downloadAudios = async (req, res) => {
    return res.status(410).json({ message: "Download via direct URL is now supported. No local files." });
};


module.exports = {
    addAudio,
    getAllAudios,
    updateAudio,
    deleteAudio,
    sendAudioEmail,
    downloadAudios
};