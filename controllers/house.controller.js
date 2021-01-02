const mongoose = require('mongoose');

const House = mongoose.model('House');
const User = mongoose.model('User');

module.exports = {
    add: (username, payload) => (
        new Promise(async (resolve, reject) => {
            try {
                const validPayload = await House.validate(payload);

                if (validPayload) return reject({
                    msg: 'invalid payload'
                });

                delete payload.ownerId;
                delete payload.isBooked;
                delete payload.bookingInfo;

                const owner = await User.findOne({ username });

                const house = new House(payload);

                owner.houses.push(house._id);
                house.ownerId = owner._id;

                await owner.save();
                await house.save();

                delete owner._id;
                delete owner.__v;
                delete house._id;
                delete house.ownerId;

                resolve(house);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),
    getAllOwned: username => (
        new Promise(async (resolve, reject) => {
            try {
                const owner = await User.findOne({ username });

                const houses = await House.find({ ownerId: owner._id });

                resolve({ houses })
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),
    edit: (id, payload) => (
        new Promise((resolve, reject) => {
            try {
                const house = await House.findById(id);

                if (!house) {
                    return reject({
                        code: 404,
                        msg: 'house not found'
                    });
                }

                house = { ...payload };

                await house.save();

                resolve(house);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    )
};