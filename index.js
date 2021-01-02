require('dotenv').config();

const arr = [
    {
        test: 'wow1',
        id: 'www'
    },
    {
        test: 'wow2',
        id: 'zz'
    },
    {
        test: 'wow3',
        id: 'eee'
    }
];

const res = {
    array: [
        {
            ...arr.test
        }
    ]
};

console.log(res);

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chalk = require('chalk');

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

    server.listen(process.env.PORT, () => {
        console.log(chalk.green('[SERVER]'), 'running on port ' + process.env.PORT);
    });
})();