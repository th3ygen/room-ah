const router = require('express').Router();

const middleware = {
    auth: require('../middlewares/auth.middleware')
};
const controller = require('../controllers/house.controller');

/* admin only */
router.get('/admin/list', [middleware.auth.verifyToken, middleware.auth.adminOnly], async (req, res) => {
    try {
        const houses = await controller.getAll();

        res.status(200).json(houses);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.get('/public/list', async (req, res) => {
    try {
        const houses = await controller.getAll();

        res.status(200).json({ houses });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
/* user only */
router.get('/list', middleware.auth.verifyToken, async (req, res) => {
    try {
        const houses = await controller.getAllOwned(req.token.username);

        res.status(200).json(houses);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.get('/rented', middleware.auth.verifyToken, async (req, res) => {
    try {
        const houses = await controller.getAllRented(req.token.username);

        res.status(200).json({
            houses
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/add', middleware.auth.verifyToken, async (req, res) => {
    try {
        const house = await controller.add(req.token.username, req.body);

        res.status(200).json({
            house
        });
    } catch(e) {
        console.log(e);
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/book', middleware.auth.verifyToken, async (req, res) => {
    try {
        await controller.book(req.token.username, req.body.houseId, req.body.enterDate);

        res.status(200).json({
            message: 'booked'
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/book/accept', middleware.auth.verifyToken, async (req, res) => {
    try {
        await controller.startRent(req.body.houseId);

        res.status(200).json({
            message: 'booked'
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/book/reject', middleware.auth.verifyToken, async (req, res) => {
    try {
        await controller.rejectBooking(req.body.houseId);

        res.status(200).json({
            message: 'rejected'
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/payments', middleware.auth.verifyToken, async (req, res) => {
    try {
        const payments = await controller.getPayments(req.token.username, req.body.houseId);

        res.status(200).json({
            payments
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/payments/approve', middleware.auth.verifyToken, async (req, res) => {
    try {
        await controller.approvePayment(req.body.paymentId, req.body.amount);

        res.status(200).json({
            message: 'payment approved'
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.get('/test/forcebill', (req, res) => {
    try {
        controller.forceUpdateBill();

        res.status(200).json({
            message: 'forced'
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.get('/view', middleware.auth.verifyToken);
router.post('/edit', middleware.auth.verifyToken, async (req, res) => {
    try {
        await controller.edit(req.body.houseId, req.body.pricing);

        res.status(200).json({
            message: 'edited'
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/delete', middleware.auth.verifyToken, async (req, res) => {
    try {
        await controller.delete(req.body.houseId);

        res.status(200).json({
            message: 'deleted'
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/bulk/delete', middleware.auth.verifyToken, async (req, res) => {
    try {
        await controller.bulkDelete(req.body.houseIds);

        res.status(200).json({
            message: 'deleted'
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});

module.exports = router;