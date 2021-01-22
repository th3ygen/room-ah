const mongoose = require('mongoose');
const validator = require('validator').default;

const User = mongoose.model('User');

const controller = {
    getInfo: u => (
        new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ username: u });

                const {
                    username,
                    photoUrl,
                    verified,
                    contact,
                    mailAddress,
                    bankDetails,
                    fullname
                } = user;

                resolve({
                    username,
                    photoUrl,
                    verified,
                    contact,
                    mailAddress,
                    bankDetails,
                    fullname
                });
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),

    getPublicInfo: username => (
        new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ username });

                resolve({
                    username,
                    photoUrl: user.photoUrl,
                    verified: user.verified,
                    contact: user.contact
                });
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),

    /* for users */
    getAllPublic: () => (
        new Promise(async (resolve, reject) => {
            try {
                const users = await User.find({ role: 'user' });

                const res = users.map(u => ({
                    username: u.username,
                    photoUrl: u.photoUrl,
                    verified: u.verified,
                    contact: u.contact 
                }));
                
                resolve(res);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),

    /* for admin only */
    getAllPrivate: () => (
        new Promise(async (resolve, reject) => {
            try {
                const users = await User.find({});

                users.forEach(u => {
                    delete u.__v;
                });

                resolve(users);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),

    update: (username, payload) => (
        new Promise(async (resolve, reject) => {
            try {
                /* validate */
                if (payload.photoUrl) {
                    if (validator.isURL(payload.photoUrl)) {
                        throw new Error('invalid photo url');
                    }
                }

                /* if (payload.contact) {
                    if (payload.contact.phoneNum) {
                        if (validator.isMobilePhone(payload.contact.phoneNum)) {
                            throw new Error('invalid phone number');
                        }
                    }
                    if (payload.contact.email) {
                        if (validator.isEmail(payload.contact.email)) {
                            throw new Error('invalid email');
                        }
                    }
                } */

                let user = await User.findOne({ username: username });

                if (payload.contact) {
                    if (!payload.contact.email) {
                        payload = {
                            contact: {
                                phoneNum: payload.contact.phoneNum,
                                email: user.contact.email
                            }
                        }
                    }
                    if (!payload.contact.phoneNum) {
                        payload = {
                            contact: {
                                phoneNum: user.contact.phoneNum,
                                email: payload.contact.email
                            }
                        }
                    }
                }
                if (payload.bankDetails) {
                    if (payload.bankDetails.name) {
                        payload = {
                            bankDetails: {
                                name: payload.bankDetails.name, 
                                bankName: user.bankDetails.bankName,
                                accountNum: user.bankDetails.accountNum
                            }
                        }
                    }
                    if (payload.bankDetails.bankName) {
                        payload = {
                            bankDetails: {
                                name: user.bankDetails.name, 
                                bankName: payload.bankDetails.bankName,
                                accountNum: user.bankDetails.accountNum
                            }
                        }
                    }
                    if (payload.bankDetails.accountNum) {
                        payload = {
                            bankDetails: {
                                name: user.bankDetails.name, 
                                bankName: user.bankDetails.bankName,
                                accountNum: payload.bankDetails.accountNum
                            }
                        }
                    }
                }

                Object.assign(user, payload);

                await user.save();

                delete user._id;
                delete user.__v;

                resolve(user);
            } catch(e) {
                console.log(e);
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),

    updateFiltered: (username, payload) => (
        new Promise(async (resolve, reject) => {
            try {
                delete payload.username;
                delete payload.password;
                delete payload.role;
                delete payload.verified;
                delete payload.verificationDocs;
                delete payload.securityQuestions;
                delete payload.houses;

                const user = await controller.update(username, payload);
                resolve(user);

                
            } catch(e) {
                console.log(e);
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),

    delete: username => (
        new Promise(async (resolve, reject) => {
            try {
                await User.findOneAndDelete({ username });

                resolve();
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    )
};

module.exports = controller;