const mongoose = require('mongoose');
const validator = require('validator').default;

const User = mongoose.model('User');

module.exports = {
    getInfo: username => (
        new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ username });

                delete user._id;
                delete user.__v;
                delete user.password;
                delete user.houses;

                resolve(user);
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

                if (payload.contact) {
                    if (payload.contact.phoneNum) {
                        if (validator.isMobilePhone(payload.contact.phoneNum)) {
                            throw new Error('invalid phone number');
                        }
                    }
                    if (payload.contact.email) {
                        if (validator.isEmail(payload.contact.email)) {
                            throw new Error('invalid phone number');
                        }
                    }
                }

                const user = await User.findOne({ username: username });

                user = {
                    ...payload
                };

                await user.save();

                delete user._id;
                delete user.__v;

                resolve(user);
            } catch(e) {
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

                const user = await this.update(username, payload);

                resolve(user);
            } catch(e) {
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