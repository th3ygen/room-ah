const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    from: { type: mongoose.Types.ObjectId, required: true },
    to: { type: mongoose.Types.ObjectId, required: true },
    ref: { type: String, required: true },
    date: { type: Date, required: true },
    hash: { type: String, required: true }
});

const Payment = mongoose.model('Payment', schema);

module.exports = Payment;