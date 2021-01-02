const nodemailer = require('nodemailer');
const helper = require('../common/helper.common');

let mailer, transporter;

module.exports = {
    send: async text => {
        try {
            const sent = await transporter.sendMail({
                from: '<foo@example.com>',
                to: '<th3ygen@gmail.com>',
                subject: 'Forgot password test',
                text,
                html: '<b>HTML here</b>'
            });

            return sent;
        } catch(e) {
            return helper.log('Nodemailer.send', e, 'error')
        }
    },

    init: async() => {
        mailer = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: mailer.user, // generated ethereal user
                pass: mailer.pass, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }
}