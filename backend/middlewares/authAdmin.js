import jwt from 'jsonwebtoken';

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        // Accept token from multiple header conventions
        // Preferred: Authorization: Bearer <token>
        let tokenCandidate = req.headers.authorization || req.headers.atoken || req.headers['x-access-token'];
        if (!tokenCandidate) {
            return res.status(401).json({ success: false, message: 'Not authorized. Login again.' });
        }

        // Extract token when using Bearer scheme; otherwise use the header value directly
        const parts = typeof tokenCandidate === 'string' ? tokenCandidate.split(' ') : [];
        const isBearer = parts.length === 2 && /^Bearer$/i.test(parts[0]);
        let token = isBearer ? parts[1] : tokenCandidate;

        // Strip surrounding quotes if present
        if (typeof token === 'string' && token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }

        if (!token || typeof token !== 'string') {
            return res.status(401).json({ success: false, message: 'Not authorized. Login again.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validate admin identity
        if (decoded.email !== process.env.ADMIN_EMAIL || (decoded.role && decoded.role !== 'admin')) {
            return res.status(401).json({ success: false, message: 'Not authorized. Login again.' });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
}

export default authAdmin;


