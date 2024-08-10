import jwt from 'jsonwebtoken';
import { tokenBlocker } from "../../model/admin/index.js";
import { config } from '../../config/index.js';
const { secret_key } = config

export const verifyToken = async (req, res, next) => {
    const { authorization: token } = req.headers;
    const tokenExist = await tokenBlocker.findOne({ where: { token: token }, raw: true });
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized! No Token Provided'
        });
    }

    if (tokenExist) {
        return res.status(401).json({
            message: "Unauthorized: Invalid Token"
        });
    }

    jwt.verify(token, secret_key, (err, data) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized: Invalid Token"
            });
        }
        req.user = data
        next();
    })
}
