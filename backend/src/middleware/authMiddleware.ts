import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/adminService';
import { sendError } from '../utils/responseHelpers';

export interface AuthRequest extends Request {
    user?: any;
    params: any;
    body: any;
    headers: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, 'No token provided', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        const decoded = verifyToken(token);
        req.user = decoded;

        next();
    } catch (error: any) {
        return sendError(res, 'Invalid or expired token', 401);
    }
};
