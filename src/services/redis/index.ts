import { createClient } from 'redis';
import { Client } from 'redis-om';

import config from '../../config';
import { jsonSchema } from '../../models/datalogs';
import { generateRedisSchema } from './redisModelGenerator';

const { redisUrl, redisUsername, redisPwd } = config;

let omClientSingleton: Client;
let dataLogRepository: any;

const redis = createClient(
    {
        url: redisUrl,
        username: redisUsername,
        password: redisPwd
    }
)

export async function initRedis() {
    await redis.connect()
    omClientSingleton = await new Client().use(redis)
}

export async function initDatalogRepo() {
    // redis schema automatic generation
    const dataLogSchema = generateRedisSchema(jsonSchema)
    dataLogRepository = omClientSingleton.fetchRepository(dataLogSchema);

    await dataLogRepository.dropIndex()
    await dataLogRepository.createIndex()
}


export { dataLogRepository }
export { redis, omClientSingleton }
