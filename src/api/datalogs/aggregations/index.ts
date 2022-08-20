export function humidityAverageAggregate(start: Number, end: Number) {
    return [
        {
            "$match": {
                "humidity": {
                    "$exists": true
                },
                $and: [{ timestamp: { $gte: start } }, { timestamp: { $lt: end } }]
            }
        },
        {
            "$group": {
                "_id": null,
                "humidityAverage": {
                    "$avg": "$humidity"
                }
            }
        },
        {
            "$project" : {
                "_id" : 0.0
            }
        }
    ] as any;
}