import mongoose, { Schema, Document } from 'mongoose';

export interface IRegion extends Document {
    code: string;
    name: string;
    baselinePopulation: number;
    baselineAt: Date;
    birthsPerSec: number;
    deathsPerSec: number;
    migrationPerSec: number;
    demographics?: {
        youth: number;
        working: number;
        elderly: number;
    };
    density?: number;
    meta: {
        source: string;
        lastUpdatedBy?: mongoose.Types.ObjectId;
        lastUpdatedAt: Date;
    };
}

const RegionSchema: Schema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        baselinePopulation: {
            type: Number,
            required: true,
            min: 0,
        },
        baselineAt: {
            type: Date,
            required: true,
        },
        birthsPerSec: {
            type: Number,
            required: true,
            default: 0,
        },
        deathsPerSec: {
            type: Number,
            required: true,
            default: 0,
        },
        migrationPerSec: {
            type: Number,
            required: true,
            default: 0,
        },
        demographics: {
            youth: Number,
            working: Number,
            elderly: Number,
        },
        density: Number,
        meta: {
            source: {
                type: String,
                default: 'Manual',
            },
            lastUpdatedBy: {
                type: Schema.Types.ObjectId,
                ref: 'AdminUser',
            },
            lastUpdatedAt: {
                type: Date,
                default: Date.now,
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IRegion>('Region', RegionSchema);
