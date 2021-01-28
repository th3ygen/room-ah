const mongoose = require('mongoose');
const schedule = require('node-schedule');

const House = mongoose.model('House');
const User = mongoose.model('User');
const Payment = mongoose.model('Payment');

/* check rents bill every month, 2 days early */
const updateBill = async () => {
    try {
        const rentedHouses = await House.find({ isRented: true });

        for (const house of rentedHouses) {
            /* get due payments */
            let totalDue = 0;
            for await (const id of house.rentData.payments) {
                const p = await Payment.findById(id);
    
                if (!p.paid) totalDue += p.amount - p.paidAmount;
            }
    
            const date = new Date(Date.now()).toString().split(' ').splice(1, 3);
            const monthYear = [date[0], date[2]].join(' ');
    
            /* create new payment for each house with status due/unpaid */
            const payment = new Payment({
                from: house.owner.username,
                to: house.rentData.username,
                ref: 'Rent bill',
                paid: false,
                date: monthYear,
                amount: house.pricing.rate + totalDue,
                paidAmount: 0
            });
    
            house.rentData.payments.push(payment);
    
            house.save();
            payment.save();
        }
    } catch(e) {
        console.log(e);
    }
    
};

schedule.scheduleJob('* * * 89 * *', updateBill);

module.exports = {
    add: (username, payload) => (
        new Promise(async (resolve, reject) => {
            try {
                delete payload.ownerId;
                delete payload.isBooked;
                delete payload.isRented;
                delete payload.bookingData;
                delete payload.rentData;

                const owner = await User.findOne({ username });

                const house = new House(payload);

                house.isBooked = false;
                house.isRented = false;

                house.bookingData.username = '';
                house.bookingData.fullname = '';
                house.bookingData.contact.email = '';
                house.bookingData.contact.phoneNum = '';
                house.bookingData.date = '';
                house.bookingData.enterDate = '';

                house.rentData.username = '';
                house.rentData.fullname = '';
                house.rentData.contact.email = '';
                house.rentData.contact.phoneNum = '';
                house.rentData.payments = [];

                owner.ownedHouses.push(house);
                house.owner.id = owner._id;
                house.owner.contact = owner.contact;

                house.createdAt = Date.now();

                await owner.save();
                await house.save();

                delete owner._id;
                delete owner.__v;
                delete house._id;
                delete house.ownerId;

                resolve(house);
            } catch(e) {
                console.log(e);
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),
    getAll: () => (
        new Promise(async (resolve, reject) => {
            try {
                const houses = await House.find({});

                houses.forEach(h => {
                    delete h.__v;
                });

                resolve(houses);
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

                const houses = await House.find({ ['owner.id']: owner._id });

                houses.forEach(h => {
                    delete h.__v;
                    delete h.owner.id;
                });

                resolve(houses);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),
    getAllRented: username => (
        new Promise(async (resolve, reject) => {
            try {
                const houses = await House.find({ $and: [ { isRented: true }, { ['rentData.username']: username } ] });

                resolve(houses);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),
    getPayments: (username, houseId) => (
        new Promise(async (resolve, reject) => {
            try {
                const house = await House.findById(houseId);

                if (house.owner.username !== username) return reject({
                    code: 401,
                    msg: 'access denied'
                });

                const payments = [];

                for await (const id of house.rentData.payments) {
                    const p = await Payment.findById(id);

                    payments.push({
                        id: p._id,
                        from: p.from,
                        to: p.to,
                        ref: p.ref,
                        date: p.date,
                        paid: p.paid,
                        amount: p.amount,
                        paidAmount: p.paidAmount
                    });
                }

                resolve(payments);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),
    edit: (houseId, payload) => (
        new Promise(async (resolve, reject) => {
            try {
                const house = await House.findById(houseId);

                if (!house) {
                    return reject({
                        code: 404,
                        msg: 'house not found'
                    });
                }

                if (payload.deposit) {
                    house.pricing.deposit = parseFloat(payload.deposit);
                }
                if (payload.rate) {
                    house.pricing.rate = parseFloat(payload.rate);
                }

                await house.save();

                resolve(house);
            } catch(e) {
                reject({
                    code: 400,
                    msg: e.message
                });
            }
        })
    ),
    delete: houseId => (
        new Promise(async (resolve, reject) => {
            try {
                const house = await House.findById(houseId);
                const owner = await User.findById(house.owner.id);

                owner.ownedHouses.splice(owner.ownedHouses.indexOf(houseId), 1);

                await owner.save();

                await House.findByIdAndDelete(houseId);
                resolve();
            } catch(e) {
                return reject({
                    code: 401,
                    msg: e
                });
            }
        })
    ),
    bulkDelete: houseIds =>  (
        new Promise(async (resolve, reject) => {
            try {
                await House.deleteMany({ _id: { $in: houseIds } });
                resolve();
            } catch(e) {
                return reject({
                    code: 401,
                    msg: e
                });
            }
        })
    ),
    book: (bookerUsername, houseId, enterDate) => (
        new Promise(async (resolve, reject) => {
            try {
                const booker = await User.findOne({ username: bookerUsername });
                const house = await House.findById(houseId);

                if (house.isBooked) return reject({
                    code: 401,
                    msg: 'house already booked'
                });

                house.isBooked = true;
                house.bookingData = {
                    username: bookerUsername,
                    fullname: booker.fullname,
                    photoUrl: booker.photoUrl,
                    contact: booker.contact,
                    date: new Date(Date.now()).toString().split(' ').splice(0, 4).join(' '),
                    enterDate
                };

                await house.save();

                resolve(house);
            } catch(e) {
                return reject({
                    code: 401,
                    msg: e
                });
            }
            
        })
        
    ),
    startRent: (houseId) => (
        new Promise(async (resolve, reject) => {
            try {
                const house = await House.findById(houseId);
                const renter = await User.findOne({ username: house.bookingData.username });

                const date = new Date(Date.now()).toString().split(' ').splice(1, 3);
                const monthYear = [date[0], date[2]].join(' ');

                const depoPayment = new Payment({
                    from: house.bookingData.username,
                    to: house.owner.username,
                    ref: 'Rent deposit',
                    date: monthYear,
                    paid: false,
                    amount: house.pricing.deposit,
                    paidAmount: 0
                });

                await depoPayment.save();

                house.isBooked = false;
                house.bookingData = {
                    username: '',
                    fullname: '',
                    photoUrl: '',
                    contact: {
                        email: '',
                        phoneNum: ''
                    },
                    date: '',
                    enterDate: ''
                };

                house.isRented = true;
                house.rentData = {
                    username: house.bookingData.username,
                    fullname: house.bookingData.fullname,
                    photoUrl: house.bookingData.photoUrl,
                    contact: house.bookingData.contact,
                    payments: [depoPayment]
                };

                renter.rentedHouses.push(house);

                await house.save();
                await renter.save();

                resolve(house);
            } catch(e) {
                console.log(e);
                return reject({
                    code: 401,
                    msg: e
                });
            }
        })
    ),
    rejectBooking: houseId => (
        new Promise(async (resolve, reject) => {
            try {
                const house = await House.findById(houseId);

                house.isBooked = false;
                house.bookingData = {
                    username: '',
                    fullname: '',
                    photoUrl: '',
                    contact: {
                        email: '',
                        phoneNum: ''
                    },
                    date: '',
                    enterDate: ''
                };

                await house.save();

                resolve();
            } catch(e) {
                console.log(e);
                return reject({
                    code: 401,
                    msg: e
                });
            }
        })
    ),
    payRent: (houseId, amount) => (
        new Promise(async (resolve, reject) => {
            try {
                const house = await House.findById(houseId);

                const payment = await Payment.findById(house.rentData.payments[house.rentData.payments.length - 1]);

                payment.paidAmount += amount;

                payment.paid =  (payment.paidAmount > payment.amount);
            } catch(e) {
                return reject({
                    code: 401,
                    msg: e
                });
            }
        })
    ),
    approvePayment: (paymentId, amount) => (
        new Promise(async (resolve, reject) => {
            try {
                const payment = await Payment.findById(paymentId);

                payment.paidAmount += amount;

                payment.paid =  (payment.paidAmount >= payment.amount);

                await payment.save();

                resolve();
            } catch(e) {
                return reject({
                    code: 401,
                    msg: e
                });
            }
        })
    ),
    forceUpdateBill: () => updateBill()
};