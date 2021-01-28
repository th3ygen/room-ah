const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    details: String,

    address: String,

    pricing: {
        deposit: Number,
        rate: Number
    },

    gps: {
        lon: Number, lat: Number
    },

    mediaFiles: [String],

    owner: {
        username: { type: String, required: true },
        contact: {
            email: String,
            phoneNum: String
        },
        id: mongoose.Types.ObjectId
    },

    isBooked: Boolean,
    bookingData: {
        username: String,
        fullname: String,
        photoUrl: String,
        contact: {
            email: String,
            phoneNum: String
        },
        date: String,
        enterDate: String
    },

    isRented: Boolean,
    rentData: {
        username: String,
        fullname: String,
        photoUrl: String,
        contact: {
            email: String,
            phoneNum: String
        },
        payments: [mongoose.Types.ObjectId]
    },

    createdAt: Number
});

const House = mongoose.model('House', schema);

module.exports = House;