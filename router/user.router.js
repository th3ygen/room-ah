const router = require('express').Router();

const middleware = {
    auth: require('../middlewares/auth.middleware')
};
const controller = require('../controllers/user.controller');

router.get('/test', middleware.auth.verifyToken, (req, res) => {
    res.status(200).json({
        message: 'ade'
    });
});

/* admin get all users */
router.get('/list', [middleware.auth.verifyToken, middleware.auth.adminOnly], async (req, res) => {
    try {
        const users = await controller.getAllPrivate();

        res.status(200).json(users);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});

/* public view */
router.get('/public', async (req, res) => {
    try {
        const users = await controller.getAllPublic();

        res.status(200).json(users);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});

/* user only view */
router.get('/profile', middleware.auth.verifyToken, async (req, res) => {
    try {
        const user = await controller.getInfo(req.token.username);

        res.status(200).json(user);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});

router.get('/view', async (req, res) => {
    try {
        const user = await controller.getPublicInfo(req.params.username);

        res.status(200).json(user);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.post('/update', middleware.auth.verifyToken, async (req, res) => {
    try {
        const { token, body: { payload } } = req;

        await controller.updateFiltered(token.username, payload);
        
        res.status(200).json({
            message: 'success'
        });
    } catch(e) {
        console.log(e);
        res.status(400).json({
            message: e.message
        });
    }
});
router.delete('/delete', [middleware.auth.verifyToken, middleware.auth.adminOnly], async (req, res) => {
    try {
        const { username } = req.body;

        await controller.delete(username);

        req.status(200);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});

module.exports = router;