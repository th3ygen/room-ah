const router = require('express').Router();

const middleware = {
    auth: require('../middlewares/auth.middleware')
};
const controller = require('../controllers/user.controller');

/* admin get all users */
router.get('/list', [middleware.auth.verifyToken, middleware.auth.adminOnly], (req, res) => {
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
router.get('/public', (req, res) => {
    try {
        const users = await controller.getAllPublic();

        res.status(200).json(users);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }

/* user only view */
router.get('/profile', middleware.auth.verifyToken, (req, res) => {
    try {
        const user = await controller.getInfo();

        res.status(200).json(user);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});

router.get('/view', (req, res) => {
    try {
        const user = await controller.getPublicInfo(req.params.username);

        res.status(200).json(user);
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});

});
router.post('/update', middleware.auth.verifyToken, (req, res) => {
    try {
        const { token, body: { payload } } = req;

        if (token.role === 'admin') {
            controller.update(token.username, payload);
        }
        if (token.role === 'user') {
            controller.updateFiltered(token.username, payload);
        }
        
    } catch(e) {
        res.status(400).json({
            message: e.msg
        });
    }
});
router.delete('/delete', [middleware.auth.verifyToken, middleware.auth.adminOnly], (req, res) => {
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