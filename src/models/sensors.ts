import { Schema, model } from 'mongoose';

export const SensorSchema = new Schema({
    code: {
        type: String
    },
    type: {
        type: String
    },
    name: {
        type: String
    },
    color: {
        type: String
    },
});

const Sensor = model('Sensor', SensorSchema);

export { Sensor };
