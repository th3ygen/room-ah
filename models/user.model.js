const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },

    fullname: String,

    photoUrl: String,

    role: String,

    verified: Boolean,
    verificationDocs: [{
        label: { type: String, required: true },
        link: { type: String, required: true },
        valid: { type: Boolean, required: true }
    }],

    securityQuestions: [{
        question: { type: String, required: true },
        answer: { type: String, required: true }
    }],

    contact: {
        phoneNum: { type: String, required: true },
        email: { type: String, required: true }
    },

    mailAddress: {
        lineOne: { type: String },
        lineTwo: String,
        city: { type: String },
        postcode: { type: String },
        country: { type: String },
    },

    bankDetails: {
        name: { type: String }, 
        bankName: { type: String },
        accountNum: { type: String }
    },

    houses: [mongoose.Types.ObjectId],
});

const User = mongoose.model('User', schema);

module.exports = User;