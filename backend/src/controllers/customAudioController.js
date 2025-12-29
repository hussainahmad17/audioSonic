const express = require('express');
const CustomAudioRequest = require('../models/CustomAudioRequest')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create Stripe Checkout Session (unchanged)
const createCheckoutSession = async (req, res) => {
  try {
    const { audioRequest, email, amount, productName } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',

      // Accept success/cancel URLs from client to avoid env dependency
      success_url: req.body?.successUrl || `${(req.headers.origin || (req.headers['x-forwarded-proto'] || 'https') + '://' + (req.headers['x-forwarded-host'] || req.headers.host))}/custome_audio_payment_success?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: req.body?.cancelUrl || `${req.headers.origin || (req.headers['x-forwarded-proto'] || 'https') + '://' + (req.headers['x-forwarded-host'] || req.headers.host)}/cancel`,
      metadata: { audioRequest, email },
      customer_email: email,
    });

    res.json({ url: session.url, id: session.id }); // Also return session ID
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};

// Send email to admin
const sendAdminNotification = (email, request) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Custom Audio Request',
    html: `
      <h3>New Premium Audio Order</h3>
      <p><strong>Customer Email:</strong> ${email}</p>
      <p><strong>Audio Request:</strong></p>
      <p>${request}</p>
      <p><strong>Delivery Deadline:</strong> ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send error:', error);
    } else {
      console.log('Admin notification sent:', info.response);
    }
  });
};

const confirmPayment = async (req, res) => {
  try {
    const { sessionId, audioRequest, customerEmail } = req.body;

    if (!sessionId) {
      console.error('No session ID provided');
      return res.status(400).json({ error: 'Session ID is required' });
    }

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError) {
      console.error('Stripe session retrieval failed:', stripeError);
      return res.status(500).json({ error: 'Stripe session retrieval failed', details: stripeError.message });
    }

    if (session.payment_status !== 'paid') {
      console.error('Payment not completed for session:', sessionId);
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Send email to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Custom Audio Request',
      html: `
        <h2>New Custom Audio Request Received</h2>
        <p><strong>Customer Email:</strong> ${customerEmail}</p>
        <p><strong>Payment Status:</strong> Paid ($${session.amount_total / 100})</p>
        <p><strong>Audio Request Description:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${audioRequest}
        </div>
        <p><strong>Order ID:</strong> ${session.id}</p>
        <p>Please process this request within 24 hours.</p>
      `,
    };

    // First make a record then send mail
    try {
      await CustomAudioRequest.create({
        email: customerEmail,
        description: audioRequest,
        amount: session.amount_total / 100, // more reliable
        date: new Date()
      });
    } catch (dbError) {
      console.error('Database error while creating CustomAudioRequest:', dbError);
      return res.status(500).json({ error: 'Database error', details: dbError.message });
    }

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error('Email sending error:', mailError);
      return res.status(500).json({ error: 'Email sending error', details: mailError.message });
    }

    res.json({ success: true, message: 'Payment confirmed and admin notified' });
  } catch (error) {
    console.error('Payment confirmation error (outer catch):', error);

    // More detailed error handling
    if (error.type === 'StripeInvalidRequestError') {
      console.error('Stripe invalid request details:', {
        code: error.code,
        message: error.message,
        requestId: error.requestId
      });

      return res.status(404).json({
        error: 'Checkout session not found',
        details: 'The session ID may be invalid, expired, or from a different Stripe account'
      });
    }

    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

const createCustomAudioRequest = async (req, res) => {
  try {
    const { email, description, budget, deadline } = req.body;

    // Validate required fields
    if (!email || !description || !budget || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Email, description, budget, and deadline are required"
      });
    }

    // Validate deadline is in the future
    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be in the future"
      });
    }

    // Create custom audio request
    const request = await CustomAudioRequest.create({
      email,
      description,
      budget,
      deadline
    });

    res.status(201).json({
      success: true,
      message: "Custom audio request created successfully",
      data: request
    });
  } catch (error) {
    console.error("Error creating custom audio request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateCustomAudioRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amountPaid, paymentStatus, audioFile, notes } = req.body;

    const request = await CustomAudioRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Custom audio request not found"
      });
    }

    // Update fields if provided
    if (status) request.status = status;
    if (amountPaid !== undefined) request.amountPaid = amountPaid;
    if (paymentStatus) request.paymentStatus = paymentStatus;
    if (audioFile) request.audioFile = audioFile;
    if (notes) request.notes = notes;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Custom audio request updated successfully",
      data: request
    });
  } catch (error) {
    console.error("Error updating custom audio request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getCustomAudioRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, status } = req.query;

    let filter = {};

    // Date range filter
    if (startDate || endDate) {
      filter.requestDate = {};
      if (startDate) filter.requestDate.$gte = new Date(startDate);
      if (endDate) filter.requestDate.$lte = new Date(endDate);
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    const requests = await CustomAudioRequest.find(filter)
      .sort({ requestDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CustomAudioRequest.countDocuments(filter);
    const totalRevenue = await CustomAudioRequest.aggregate([
      ...(startDate || endDate ? [{
        $match: {
          requestDate: {
            ...(startDate ? { $gte: new Date(startDate) } : {}),
            ...(endDate ? { $lte: new Date(endDate) } : {})
          }
        }
      }] : []),
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);

    res.status(200).json({
      success: true,
      data: requests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalRequests: total,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
    });
  } catch (error) {
    console.error('Error fetching custom audio requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
  createCheckoutSession,
  sendAdminNotification,
  confirmPayment,
  createCustomAudioRequest,
  updateCustomAudioRequest,
  getCustomAudioRequests
}