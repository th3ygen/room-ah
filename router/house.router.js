const router = require('express').Router();

const middleware = {
    auth: require('../middlewares/auth.middleware')
};
const controller = require('../controllers/house.controller');

router.get('/all', middleware.auth.verifyToken, async (req, res) => {
    try {
        const houses = await controller.getAllOwned(req.token.username);

        res.status(200).json({ houses });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.get('/add', middleware.auth.verifyToken, async (req, res) => {
    try {
        const house = await controller.add(req.token.username, req.body);

        res.status(200).json({
            house
        });
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.get('/view', middleware.auth.verifyToken);
router.post('/edit', middleware.auth.verifyToken);
router.delete('/delete', middleware.auth.verifyToken);

module.exports = router;