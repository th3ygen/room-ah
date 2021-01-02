const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },

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
        lineOne: { type: String, required: true },
        lineTwo: String,
        city: { type: String, required: true },
        postcode: { type: String, required: true },
        country: { type: String, required: true },
    },

    bankDetails: {
        name: { type: String, required: true }, 
        accountNum: { type: String, required: true },
        bankName: { type: String, required: true }
    },

    houses: [mongoose.Types.ObjectId],
});

const User = mongoose.model('User', schema);

module.exports = User;