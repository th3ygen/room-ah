const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    from: String,
    to: String,
    ref: String,
    date: String,
    paid: Boolean,
    amount: Number,
    paidAmount: Number
});

const Payment = mongoose.model('Payment', schema);

module.exports = Payment;