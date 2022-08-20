import { Schema, model, Types } from 'mongoose';
import { sensorMqttMessage } from '../interfaces/deviceMessage';
import { Sensor } from './sensors';
import { DataLogDocument, DataLogModelInterface } from '../interfaces/dataLog';
import { dataLogRepository } from '../services/redis';
import { Alarm } from './alarms';
import { checkRule } from '../services/ruleEngine';

import logger from '../services/logger/index';
import moment from 'moment';
import * as _ from 'lodash';

const BluePromise = require('bluebird');

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
    humidity: {
        type: Number
    }
}

export const DataLogSchema = new Schema<DataLogDocument>(jsonSchema);

DataLogSchema.statics.parseMessage = async function (message: sensorMqttMessage) {
    const { sensorCode, value, measureUnit, humidity } = message;
    const sensor = await Sensor.findOne({ code: sensorCode });

    if (_.isNil(sensor)) {
        return logger.error('sensor not found with code: ' + sensorCode)
    }

    const alarmsToCheck = await Alarm.find({sensorId: sensor._id, type: 'rule'})

    await BluePromise.map(alarmsToCheck, (alarm: any) => {
        return checkRule(Number(value), alarm.rule, sensor._id, alarm._id, alarm.name)
    })

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
        humidity: humidity || 40,
        measureUnit: measureUnit,
        timestamp: moment().unix()
    })
}

const DataLog = model<DataLogDocument, DataLogModelInterface>('DataLog', DataLogSchema);

export { DataLog };

