import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
}

const AdminUserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'admin',
            enum: ['admin', 'superadmin'],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
