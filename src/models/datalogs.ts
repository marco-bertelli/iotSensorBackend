import { Schema, model, Types } from 'mongoose';

export const DataLogSchema = new Schema({
    machineId: {
        type: Types.ObjectId
    },
    value: {
        type: String
    },
    measureUnit: {
        type: String
    },
});

const DataLog = model('DataLog', DataLogSchema);

export { DataLog };
