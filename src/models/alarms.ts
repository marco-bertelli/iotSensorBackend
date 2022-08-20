import { Schema, model, Types } from 'mongoose';

export const AlarmSchema = new Schema({
    sensorId: {
        type: Types.ObjectId
    },
    ruleId: {
        type: Types.ObjectId
    },
    rule: {
        type: Object
    },
    name: {
        type: String
    },
    type: {
        type: String,
        enum: ['active', 'finish', 'rule']
    },
    triggerValue: {
        type: Number
    },
    detriggerValue: {
        type: Number
    },
    startDate: {
        type: Date
    },
    finishDate: {
        type: Date
    }
});

const Alarm = model('Alarm', AlarmSchema);

export { Alarm };
