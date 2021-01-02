const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    address: {
        lineOne: String,
        lineTwo: String,
        city: String,
        postcode: String,
        country: String,
    },

    pricing: {
        deposit: Number,
        rate: Number
    },

    gps: {
        lon: Number, lat: Number
    },

    details: String,

    mediaFiles: [{
        label: { type: String, required: true },
        link: { type: String, required: true }
    }],

    ownerId: { type: mongoose.Types.ObjectId, required: true },

    isBooked: Boolean,
    bookingInfo: {
        date: Date,
        enterDate: Date,
        payments: [mongoose.Types.ObjectId]
    }
});

const House = mongoose.model('House', schema);

module.exports = House;