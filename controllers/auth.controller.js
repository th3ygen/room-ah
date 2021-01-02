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
                const sameUsername = await User.findOne({ username });

                if (sameUsername) {
                    return reject({
                        code: 400,
                        msg: 'username already exist'
                    });
                }

                const user = new User(payload);

                user.password = await bcrypt.hash(user.password, process.env.HASH_SALT);

                user.role = 'user';
                user.verified = false;

                await user.save();

                delete user._id;
                delete user.__v;

                resolve();
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
    }
};