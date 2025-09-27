// server/middleware/roleAuth.js
module.exports = function (roles = ['admin']) { // Default access is for 'admin' only
    return (req, res, next) => {
        // req.user is attached by the main auth middleware (server/middleware/auth.js)
        if (!req.user || !req.user.role) {
            return res.status(401).json({ msg: 'Authorization required.' });
        }

        const userRole = req.user.role;
        
        // Check if the user's role is included in the allowed roles array
        if (!roles.includes(userRole)) {
            console.log(`Access Denied: User role ${userRole} attempted to access route restricted to ${roles.join(', ')}`);
            return res.status(403).json({ msg: 'Access denied: Insufficient privileges.' });
        }
        
        // If the role is authorized, continue to the route handler
        next();
    };
};