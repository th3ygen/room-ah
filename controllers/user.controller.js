const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
    update: payload => (
        new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ username: req.token.username });

                if (!user) {
                    return reject({
                        code: 400,
                        msg: e.message
                    });
                }
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    )
};