const express = require('express');

const router = express.Router();
const main = express.Router();

const auth = require('./auth.router');
const user = require('./user.router');
const house = require('./house.router');
const page = require('./page.router');

router.use('/auth', auth);
router.use('/user', user);
router.use('/house', house);

main.use(page);
main.use('/api', router);

module.exports = main;