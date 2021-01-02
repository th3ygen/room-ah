const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    details: String,

    address: {
        lineOne: { type: String, required: true },
        lineTwo: String,
        city: { type: String, required: true },
        postcode: { type: String, required: true },
        country: { type: String, required: true }
    },

    pricing: {
        deposit: Number,
        rate: Number
    },

    gps: {
        lon: Number, lat: Number
    },

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