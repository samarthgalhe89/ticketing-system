// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get token from the header
    // The token is typically sent as 'Authorization: Bearer <token>'
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // 3. Verify token using the secret key
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        // 4. Attach user payload (ID and role) to the request object
        req.user = decoded.user;
        next(); // Move to the next function (the ticket route)
    } catch (err) {
        // 5. If verification fails
        res.status(401).json({ msg: 'Token is not valid' });
    }
};