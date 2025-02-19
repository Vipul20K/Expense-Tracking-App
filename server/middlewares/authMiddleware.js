
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    
    
    // Check if Authorization header is present
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            msg: 'Authorization token is missing or invalid'
        });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                msg: 'Invalid or expired token'
            });
        }
       
        // Attach user information to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route
    });
};

module.exports = authenticateJWT;
