import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config({ path: '.env.server' });
dotenv.config();

const app = express();
const port = Number(process.env.PAYMENT_PORT || 5000);

const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

if (!keyId || !keySecret) {
  console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Payment APIs will fail until configured.');
}

const getRazorpayClient = () => {
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured.');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:8080,http://localhost:8081,http://localhost:8082')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json());

app.get('/api/payment/health', (_req, res) => {
  res.json({ ok: true, service: 'payment-api' });
});

app.post('/api/payment/create-order', async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    const amount = Number(req.body?.amount);
    const currency = String(req.body?.currency || 'INR');
    const receipt = String(req.body?.receipt || `receipt_${Date.now()}`);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount.' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
      payment_capture: true,
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('create-order error:', error);
    const errorMessage =
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof error.error === 'object' &&
      error.error !== null &&
      'description' in error.error
        ? String(error.error.description)
        : error instanceof Error
          ? error.message
          : 'Failed to create payment order.';

    return res.status(500).json({ message: errorMessage });
  }
});

app.post('/api/payment/verify', (req, res) => {
  try {
    if (!keySecret) {
      return res.status(500).json({ message: 'RAZORPAY_KEY_SECRET is not configured.' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }

    return res.json({ verified: true });
  } catch (error) {
    console.error('verify-payment error:', error);
    return res.status(500).json({ message: 'Failed to verify payment.' });
  }
});

app.listen(port, () => {
  console.log(`Payment API running on http://localhost:${port}`);
});
