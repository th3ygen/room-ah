const router = require('express').Router();

const controller = require('../controllers/auth.controller');
const middleware = require('../middlewares/auth.middleware');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const login = await controller.login(username, password);
        
        res.status(200).json(login);
    } catch(error) {
        res.status(error.code).json({
            message: error.msg
        });
    }
});
router.post('/register', async (req, res) => {
    try {
        const user = await controller.register(req.body.payload);

        res.status(200).json(user);
    } catch(error) {
        res.status(error.code).json({
            message: error.msg
        });
    }
});
router.post('/forgot', async (req, res) => {
    
});
router.post('/validate', async (req, res) => {
    const v = await controller.validate(req.body.payload);

    res.status(200).json({ v });
});
router.post('/verify', async (req, res) => {
    try {
        const u = middleware.verifyTokenPost(req.body.token.toString());

        res.status(200).json(u);
    } catch(e) {
        res.status(401).json({
            message: 'unauthorized'
        });
    }
});
module.exports = router;