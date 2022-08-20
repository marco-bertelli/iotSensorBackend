import { Entity, Schema } from 'redis-om';
import * as _ from 'lodash';

export function generateRedisSchema(mongooseSchema: any) {
    class genricClass extends Entity {}

    const redisSchema = mongooseMapper(mongooseSchema);

    const schema = new Schema(genricClass, redisSchema);
    return schema;
}

function mongooseMapper(mongooseSchema: any) {
    const arraySchema = _.map(mongooseSchema, (value, key) => {
        const type = typeParser(functionName(value))
        return { key, type }
    })

    return _.reduce(arraySchema, (obj: any, value) => {
        if (value.type === 'number') {
            obj[value.key] = { type: value.type, sortable: true }
            return obj;
        }

        obj[value.key] = { type: value.type }

        return obj
    }, {})
}

function typeParser(value: any) {
    if (value.toLowerCase() === 'objectid') {
        return 'string'
    }

    return value.toLowerCase()
}

const functionName = ((x: any) => (typeof x.type === 'function' ? x.type.name : x));