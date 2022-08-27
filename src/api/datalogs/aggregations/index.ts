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
            "$project": {
                "_id": 0.0
            }
        }
    ] as any;
}

export function temperatureAverageAggregate(start: Number, end: Number) {
    return [
        {
            "$match": {
                $and: [{ timestamp: { $gte: start } }, { timestamp: { $lt: end } }]
            }
        }, {
            "$addFields": {
                "temp": {
                    "$toDecimal": "$value"
                }
            }
        },
        {
            "$group": {
                "_id": null,
                "tempAverage": {
                    "$avg": "$temp"
                }
            }
        },
        {
            "$project": {
                "_id": 0.0
            }
        }
    ] as any;
}

export function actualDataAggregation(start: number, end: number) {
    return [
        {
            "$match": {
                $and: [{ timestamp: { $gte: start } }, { timestamp: { $lt: end } }]
            }
        },
        {
            "$sort": {
                "timestamp": -1.0
            }
        },
        {
            "$group": {
                "_id": null,
                "currentTemp": {
                    "$first": "$value"
                },
                "currentHum": {
                    "$first": "$humidity"
                },
                "maxTemp": {
                    "$max": "$value"
                },
                "minTemp": {
                    "$min": "$value"
                }
            }
        },
        {
            "$project": {
                "_id": 0.0
            }
        }
    ] as any;
}