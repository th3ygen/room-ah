const express = require('express');
const path = require('path');
const root = require('app-root-path').path;

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

/* front end source files */
main.use('/source', express.static('./public'));

module.exports = main;