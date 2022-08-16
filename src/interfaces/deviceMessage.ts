import { Types } from "mongoose"

export type notificationRabbitMessage = {
    _id: Types.ObjectId
    event: String,
    sent: Boolean,
    type: String,
    title: String,
    body: String,
    data: any,
    targetUserId: Types.ObjectId
}