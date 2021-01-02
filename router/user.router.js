const router = require('express').Router();

const middleware = {
    auth: require('../middlewares/auth.middleware')
};
const controller = require('../controllers/user.controller');

router.get('/view');
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
router.delete('/delete');

module.exports = router;