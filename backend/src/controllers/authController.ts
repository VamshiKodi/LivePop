import { Request, Response } from 'express';
import Joi from 'joi';
import { loginAdmin } from '../services/adminService';
import { sendSuccess, sendError } from '../utils/responseHelpers';

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

export const login = async (req: Request, res: Response) => {
    try {
        const { error } = loginSchema.validate(req.body);

        if (error) {
            return sendError(res, error.details[0].message, 400);
        }

        const { username, password } = req.body;

        const result = await loginAdmin(username, password);

        return sendSuccess(res, result, 200);
    } catch (error: any) {
        return sendError(res, error.message || 'Login failed', 401);
    }
};
