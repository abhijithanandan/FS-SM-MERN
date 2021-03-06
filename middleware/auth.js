const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {

    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token exist
    if(!token) {
        return res.status(401).json({ msg: 'No Token, authorization denied'});
    }

    //Verify token 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user.id;
        next();
    } catch (error) {
       res.status(401).json({ msg: 'Token is not valid' });
    }
}