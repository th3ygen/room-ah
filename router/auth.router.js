const router = require('express').Router();

const controller = require('../controllers/auth.controller');

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
        const user = await controller.register(req.body);

        res.status(200).json(user);
    } catch(error) {
        res.status(error.code).json({
            message: error.msg
        });
    }
});
router.post('/forgot', async (req, res) => {
    
});

module.exports = router;