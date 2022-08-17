import { Schema, model, Types } from 'mongoose';
import { sensorMqttMessage } from '../interfaces/deviceMessage';
import { Sensor } from './sensors';
import { DataLogDocument, DataLogModelInterface } from '../interfaces/dataLog';

import logger from '../services/logger/index';

import * as _ from 'lodash';
import moment from 'moment';
import { dataLogRepository } from '../services/redis';

export const jsonSchema = {
    sensorId: {
        type: Types.ObjectId
    },
    value: {
        type: String
    },
    measureUnit: {
        type: String
    },
    timestamp: {
        type: Number
    },
}

export const DataLogSchema = new Schema<DataLogDocument>(jsonSchema);

DataLogSchema.statics.parseMessage = async function (message: sensorMqttMessage) {
    const { sensorCode, value, measureUnit } = message;
    const sensor = await Sensor.findOne({ code: sensorCode });

    if (_.isNil(sensor)) {
        return logger.error('sensor not found with code: ' + sensorCode)
    }

    // TODO here alarm logic and control

    // insert also in redis
    await dataLogRepository.createAndSave({
        sensorId: sensor._id.toString(),
        value: value,
        measureUnit: measureUnit,
        timestamp: moment().unix()
    });

    return await this.create({
        sensorId: sensor._id,
        value: value,
        measureUnit: measureUnit,
        timestamp: moment().unix()
    })
}

const DataLog = model<DataLogDocument, DataLogModelInterface>('DataLog', DataLogSchema);

export { DataLog };

