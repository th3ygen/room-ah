require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chalk = require('chalk');
const root = require('app-root-path').path;
const path = require('path');

const mongo = require('./services/mongodb.service');
const nodemailer = require('./services/nodemailer.service');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const server = require('http').createServer(app);

// async wrapper
(async () => {
    await mongo.connectWithRetry();

    require('./models/house.model');
    require('./models/payment.model');
    require('./models/user.model');

    app.use(require('./router'));

    /* 404 */
    app.use((req, res, next) => {
        res.status(404).sendFile(path.join(root, 'public/routes/guest/404.html'));
    });

    server.listen(process.env.PORT, () => {
        console.log(chalk.green('[SERVER]'), 'running on port ' + process.env.PORT);
    });
})();