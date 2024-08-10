import jwt from 'jsonwebtoken';
import { tokenBlocker } from '../../../model/admin/index.js'; // Correct path to model
import { config } from '../../../config/index.js'; // Correct path to config

const { secret_key } = config;

const verifyToken = async (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized! No Token Provided' });
    }

    // Extract the token from the Bearer token format
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized! No Token Provided' });
    }

    try {
        // Check if the token exists in the tokenBlocker model
        const tokenExist = await tokenBlocker.findOne({ where: { token }, raw: true });
        if (tokenExist) {
            return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
        }

        // Verify the token using JWT
        jwt.verify(token, secret_key, (err, data) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
            }
            req.user = data;
            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default verifyToken;
