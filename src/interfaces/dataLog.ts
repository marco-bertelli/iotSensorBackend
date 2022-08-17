import { Model, Types } from "mongoose"
import { sensorMqttMessage } from "./deviceMessage"

export interface DataLogDocument extends Document {
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
        type: Date
    }
}


export interface DataLogModelInterface extends Model<DataLogDocument> {
    parseMessage(mqttMessage: sensorMqttMessage): any;
}