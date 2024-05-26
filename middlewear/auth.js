const jwt = require('jsonwebtoken');
const { userModel } = require('../DB/model/user.model');

const auth = () => {
    return async (req, res, next) => {
        try {
            const token = req.headers.token;
            if (!token) {
                return res.status(401).json({ message: 'Authorization token is missing' });
            }
            
            const decoded = jwt.verify(token, process.env.TokenSignature);
            const user = await userModel.findById(decoded.id).select('_id');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };
};

module.exports = auth;
