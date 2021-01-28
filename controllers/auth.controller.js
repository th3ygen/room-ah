const mongoose = require('mongoose');

const helper = require('../common/helper.common');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = mongoose.model('User');

module.exports = {
    login: (username, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ username });

                if (!user) {
                    return reject({
                        code: 401,
                        msg: 'no user found'
                    });
                }

                const pwMatches = await bcrypt.compare(password, user.password);

                if (!pwMatches) {
                    return reject({
                        code: 401,
                        msg: 'wrong password'
                    });
                }

                const token = jwt.sign({
                    username: user.username,
                    role: user.role
                }, process.env.JWT_KEY);

                delete user._id;
                delete user.__v;

                resolve(token);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    },

    register: payload => (
        new Promise(async (resolve, reject) => {
            try {
                const user = new User(payload);

                user.password = await bcrypt.hash(user.password, parseInt(process.env.HASH_SALT));

                if (!user.photoUrl) {
                    user.photoUrl = "";
                }

                user.role = 'user';
                user.verified = false;

                user.rentedHouses = [];
                user.ownedHouses = [];

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

    securityQuestion: {
        add: (username, question, answer) => (
            new Promise(async (resolve, reject) => {
                try {
                    const user = await User.findOne({ username });

                    answer = await bcrypt.hash(answer, process.env.HASH_SALT);
    
                    user.securityQuestions.push({
                        question, answer
                    });
    
                    resolve({
                        question, answer
                    });
                } catch(e) {
                    reject({
                        code: 400,
                        msg: e.message
                    });
                }
            })
        ),

        get: username => (
            new Promise(async (resolve, reject) => {
                try {
                    const user = await User.findOne({ username });
    
                    if (!user.securityQuestions.length && user.securityQuestions.length === 0) {
                        return reject({
                            code: 400,
                            msg: 'no security question found'
                        });
                    }
        
                    const x = helper.rnd(0, user.securityQuestions.length);
        
                    resolve(user.securityQuestions[x].question);
                } catch(e) {
                    reject({
                        code: 400,
                        msg: e.message
                    });
                }
                
            })
        ),
    
        verifyAnswer: (username, question, answer) => (
            new Promise(async (resolve, reject) => {
                try {
                    const user = await User.findOne({ username });
    
                    const schema = user.securityQuestions.find(q => (q.question === question));
    
                    const valid = await bcrypt.compare(answer, schema.answer);
    
                    if (valid) {
                        return resolve();
                    }
    
                    reject({
                        code: 401,
                        msg: 'wrong answer'
                    });
                } catch(e) {
                    reject({
                        code: 400,
                        msg: e.message
                    });
                }
            })
        )
    },

    validate: payload => (
        new Promise(async (resolve, reject) => {
            const res = [];

            /* unique username */
            try {
                const user = await User.findOne({ username: payload.username });

                if (user) {
                    res.push({
                        label: 'username',
                        message: 'Username has been taken'
                    });
                }
            } catch(e) {}

            /* used email */
            try {
                const user = await User.findOne({ ['contact.email']: payload.email });

                if (user) {
                    res.push({
                        label: 'email',
                        message: 'Email has been taken'
                    });
                }
            } catch(e) {}
            

            resolve(res);
        })
    )
};