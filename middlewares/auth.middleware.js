const jwt = require('jsonwebtoken');
const base64 = require('base-64');

module.exports = {
    verifyToken: (req, res, next) => {
        try {
            if (req.headers['auth-token'].split(' ')[0].toString() !== 'Token') {
                return res.status(401).json({
                    message: 'invalid token'
                });
            }

            const token = req.headers['auth-token'].split(' ')[1].toString();

            const header = JSON.parse(base64.decode(token.split('.')[0]));

            if (header['alg'] === 'none') {
                return res.status(401).json({
                    message: 'invalid token'
                });
            }

            if (!token) {
                return res.status(401).json({
                    message: 'invalid token'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_KEY);

            if (!decoded) {
                return res.status(401).json({
                    message: 'invalid token'
                });
            }

            req.token = decoded
            next();
        } catch(e) {
            res.status(400).json({
                message: e.message
            });
        }
    },

    adminOnly: (req, res, next) => {
        try {
            if (req.token.role === 'admin') {
                return next();
            }

            res.status(401).json({
                message: 'unauthorized access'
            });
        } catch(e) {
            res.status(400).json({
                message: e.message
            });
        }
    }
};