import { createClient } from 'redis';
import { Client } from 'redis-om';

import config from '../../config';

const { redisUrl, redisUsername, redisPwd } = config;

let omClientSingleton;

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

export { redis, omClientSingleton }
