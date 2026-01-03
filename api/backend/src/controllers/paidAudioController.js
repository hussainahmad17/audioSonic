const PaidAudio = require("../models/PaidAudio");
const PaidAudioPurchase = require('../models/PaidAudioPurchase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require("path");
const fs = require("fs");
const nodemailer = require('nodemailer');
const { uploadAudioBuffer } = require("../config/cloudinary");
const mm = require('music-metadata');
const { sendEmailWithAudio } = require("./generalEmailSender");
require("dotenv").config();

const addAudio = async (req, res) => {
    const { title, description, rating, priceAmount, categoryId, subCategoryId, language, voice } = req.body;
    const audioFile = req.file ? req.file.originalname : null;
    if (!title || !description || !rating || !priceAmount ||
        !categoryId || !subCategoryId || !audioFile || !language || !voice) {
        return res.status(400).json({
            message: "All fields are required (title, description, rating, priceAmount, categoryId, subCategoryId, audioFile, language, voice)"
        });
    }
    if (parseFloat(priceAmount) < 0) {
        return res.status(400).json({ message: "priceAmount must be greater than or equal to 0" });
    }
    try {
        let duration = 0;
        let uploadedUrl = null;
        if (req.file && req.file.buffer) {
            try {
                const metadata = await mm.parseBuffer(req.file.buffer, { mimeType: req.file.mimetype });
                duration = Math.round(metadata.format.duration || 0);
            } catch (err) {
                console.error("Duration extraction error:", err);
                duration = 0;
            }
            try {
                const filename = `${Date.now()}${path.extname(req.file.originalname)}`;
                const result = await uploadAudioBuffer(req.file.buffer, filename, req.file.mimetype);
                uploadedUrl = result.url;
                if (!duration && result.duration) {
                    duration = Math.round(result.duration);
                }
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({ message: "Failed to upload audio" });
            }
        }
        const newAudio = await PaidAudio.create({
            title,
            description,
            rating: parseFloat(rating),
            priceAmount: parseFloat(priceAmount),
            categoryId,
            subCategoryId,
            audioFile: uploadedUrl || audioFile,
            language,
            voice,
            duration: duration
        });
        await newAudio.save();
        return res.status(201).json({ message: "Paid audio uploaded successfully", audio: newAudio });
    } catch (error) {
        console.error("Error handling paid audio post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getAllAudios = async (req, res) => {
    try {
        const audios = await PaidAudio.find()
            .populate("categoryId", "categoryName")
            .populate("subCategoryId", "Name")
            .sort({ createdAt: -1 });
        const origin = `${req.protocol}://${req.get('host')}`;
        const audiosWithUrl = audios.map(audio => ({
            ...audio.toObject(),
            audioUrl: (audio.audioFile && /^https?:\/\//i.test(audio.audioFile))
                ? audio.audioFile
                : `${origin}/uploads/paid-audio/${audio.audioFile}`
        }));
        const totalRevenue = audiosWithUrl.reduce((sum, audio) => sum + (audio.revenue || 0), 0);
        const totalDownloads = audiosWithUrl.reduce((sum, audio) => sum + (audio.downloads || 0), 0);
        return res.status(200).json({ success: true, data: audiosWithUrl, count: audiosWithUrl.length, totalRevenue, totalDownloads });
    } catch (error) {
        console.error("Error fetching paid audios:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateAudio = async (req, res) => {
    const { id } = req.params;
    const { title, description, rating, priceAmount, categoryId, subCategoryId, language, voice } = req.body;
    const audioFile = req.file ? req.file.originalname : null;
    try {
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (rating) updateData.rating = parseFloat(rating);
        if (priceAmount !== undefined) updateData.priceAmount = parseFloat(priceAmount);
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
        const updatedAudio = await PaidAudio.findByIdAndUpdate(id, updateData, { new: true })
            .populate("categoryId", "categoryName")
            .populate("subCategoryId", "Name");
        if (!updatedAudio) return res.status(404).json({ message: "Paid audio not found" });
        return res.status(200).json({ success: true, message: "Paid Audio updated successfully", data: updatedAudio });
    } catch (error) {
        console.error("Error updating paid audio:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteAudio = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAudio = await PaidAudio.findByIdAndDelete(id);
        if (!deletedAudio) return res.status(404).json({ message: "Paid audio not found" });
        return res.status(200).json({ message: "Paid audio deleted successfully", deletedAudio: { title: deletedAudio.title, priceAmount: deletedAudio.priceAmount } });
    } catch (error) {
        console.error("Error deleting paid audio:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const handleCheckOut = async (req, res) => {
    try {
        const { audioId, email, successUrl, cancelUrl } = req.body;
        if (!audioId || !email || !successUrl || !cancelUrl) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        const audio = await PaidAudio.findById(audioId);
        if (!audio) {
            return res.status(404).json({ error: 'Audio not found' });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: audio.title, description: audio.description.substring(0, 200) },
                        unit_amount: Math.round(audio.priceAmount * 100)
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            customer_email: email,
            success_url: successUrl.replace('{CHECKOUT_SESSION_ID}', '{CHECKOUT_SESSION_ID}'),
            cancel_url: cancelUrl,
            metadata: { audioId: audio._id.toString(), email, title: audio.title, description: audio.description }
        });
        res.json({ url: session.url });
    } catch (error) {
        console.error('Checkout session error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
}

const handleConfirm = async (req, res) => {
    try {
        const { session_id } = req.query;
        const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] });
        const customerEmail = session.customer_details.email;
        const audioId = session.metadata.audioId;
        const audio = await PaidAudio.findById(audioId);
        if (!audio) return res.status(404).json({ error: 'Audio not found' });
        audio.downloads += 1;
        await audio.save();
        const origin = `${req.protocol}://${req.get('host')}`;
        const audioUrl = (audio.audioFile && /^https?:\/\//i.test(audio.audioFile)) ? audio.audioFile : `${origin}/uploads/paid-audio/${audio.audioFile}`;
        await PaidAudioPurchase.create({ email: customerEmail, audioId: audio._id, amount: session.amount_total / 100, date: new Date() });
        await sendEmailWithAudio({ email: customerEmail, audioId: audio._id, audioTitle: audio.title, audioDescription: audio.description, audioUrl });
        res.json({ audio: { _id: audio._id, title: audio.title, description: audio.description, audioFile: audio.audioFile, priceAmount: audio.priceAmount, duration: audio.duration } });
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
}

const downloadPaidAudio = async (req, res) => {
    return res.status(410).json({ success: false, message: "Download via direct URL is now supported. No local files." });
};

module.exports = { addAudio, getAllAudios, updateAudio, deleteAudio, handleCheckOut, handleConfirm, downloadPaidAudio };
