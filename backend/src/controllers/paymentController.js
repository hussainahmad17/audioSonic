const PaidAudio = require('../models/PaidAudio.js');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is missing!');
  process.exit(1);
}

const handlePayment = async (req, res) => {
  try {
    const { audioId } = req.body;

    // Fetch audio from DB to get price
    const audio = await PaidAudio.findById(audioId);
    if (!audio) return res.status(404).json({ error: 'Audio not found' });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(audio.priceAmount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { audioId }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}



module.exports = {
  handlePayment
};