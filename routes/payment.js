const express = require('express')
const router = express.Router();

const {
    processPayment,
    sendStripApi,
    processPaymentOnDelivery
} = require('../controllers/paymentController')

const { isAuthenticatedUser } = require('../middlewares/auth')

router.route('/payment/process').post(isAuthenticatedUser, processPayment);
router.route('/stripeapi').get(isAuthenticatedUser, sendStripApi);

router.post('/payment/process-payment-on-delivery',isAuthenticatedUser, processPaymentOnDelivery);

module.exports = router;