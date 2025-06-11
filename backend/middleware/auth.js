// Middleware for authenticating requests using JWT (JSON Web Token)
// This middleware checks for a valid JWT in the Authorization header of incoming requests
// and attaches the decoded user information to the request object if authentication succeeds.

const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for JWT operations

function auth(req, res, next) {
  // Retrieve the Authorization header from the request
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // If no Authorization header is present, respond with 401 Unauthorized
    return res.status(401).json({ message: 'No token provided' });
  }
  // The Authorization header is expected to be in the format: 'Bearer <token>'
  const token = authHeader.split(' ')[1];
  if (!token) {
    // If the token is missing or the format is invalid, respond with 401 Unauthorized
    return res.status(401).json({ message: 'Invalid token format' });
  }
  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug: log the decoded token payload
    if (!decoded.userId) {
      // If the decoded token does not contain a userId, treat as invalid
      return res.status(401).json({ message: 'Token missing userId' });
    }
    // Attach the decoded token payload to the request object for downstream use
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // If token verification fails (invalid or expired), respond with 401 Unauthorized
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Export the middleware function for use in route protection
module.exports = auth;