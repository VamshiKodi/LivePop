import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser, { IAdminUser } from '../models/AdminUser';

export interface LoginResponse {
    token: string;
    user: {
        username: string;
        email: string;
        role: string;
    };
}

/**
 * Create a new admin user
 */
export const createAdminUser = async (
    username: string,
    email: string,
    password: string,
    role: string = 'admin'
): Promise<IAdminUser> => {
    const passwordHash = await bcrypt.hash(password, 10);

    const adminUser = new AdminUser({
        username,
        email,
        passwordHash,
        role,
    });

    await adminUser.save();
    return adminUser;
};

/**
 * Authenticate admin user and return JWT token
 */
export const loginAdmin = async (
    usernameOrEmail: string,
    password: string
): Promise<LoginResponse> => {
    // Find user by username or email
    const user = await AdminUser.findOne({
        $or: [{ username: usernameOrEmail.toLowerCase() }, { email: usernameOrEmail.toLowerCase() }],
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
        {
            userId: user._id,
            username: user.username,
            role: user.role,
        },
        jwtSecret,
        { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    return {
        token,
        user: {
            username: user.username,
            email: user.email,
            role: user.role,
        },
    };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): any => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }

    return jwt.verify(token, jwtSecret);
};
