import { Types } from "mongoose"

export type sensorMqttMessage = {
   sensorCode: String,
   value: String,
   measureUnit: String,
   humidity: String
}