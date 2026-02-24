import mongoose, { Schema, Document } from 'mongoose';

export interface IHistoryItem extends Document {
    regionCode: string;
    change: {
        baselinePopulation?: number;
        baselineAt?: Date;
        birthsPerSec?: number;
        deathsPerSec?: number;
        migrationPerSec?: number;
    };
    changedBy: mongoose.Types.ObjectId;
    changedAt: Date;
    note?: string;
}

const HistoryItemSchema: Schema = new Schema({
    regionCode: {
        type: String,
        required: true,
        uppercase: true,
    },
    change: {
        type: Schema.Types.Mixed,
        required: true,
    },
    changedBy: {
        type: Schema.Types.ObjectId,
        ref: 'AdminUser',
        required: true,
    },
    changedAt: {
        type: Date,
        default: Date.now,
    },
    note: {
        type: String,
        trim: true,
    },
});

// Index for efficient querying
HistoryItemSchema.index({ regionCode: 1, changedAt: -1 });

export default mongoose.model<IHistoryItem>('HistoryItem', HistoryItemSchema);
