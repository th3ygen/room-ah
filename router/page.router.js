const root = require('app-root-path').path;
const path = require('path');
const express = require('express');
const router = express.Router();
const user = express.Router();
const middlewares = require('../middlewares/auth.middleware');

router.get('/home', (req, res) => {
    res.sendFile(path.join(root, 'public/routes/guest/homepage.html'));
});
router.get('/rent', (req, res) => {
    res.sendFile(path.join(root, 'public/routes/guest/rent.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(root, 'public/routes/guest/login.html'));
});
router.get('/signup', (req, res) => {
    res.sendFile(path.join(root, 'public/routes/guest/signup.html'));
});

user.get('/dashboard', (req, res) => {
    res.sendFile(path.join(root, 'public/routes/user/dashboard.html'));
});
user.get('/owned', (req, res) => {
    res.sendFile(path.join(root, 'public/routes/user/owned.html'));
});
user.get('/profile', (req, res) => {
    res.sendFile(path.join(root, 'public/routes/user/profile.html'));
});
user.get('/renting', (req, res) => {
    res.sendFile(path.join(root, 'public/routes/user/rented.html'));
});

router.use('/user', user);

module.exports = router;