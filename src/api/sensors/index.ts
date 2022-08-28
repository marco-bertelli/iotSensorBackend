import { Router } from 'express';
import { Sensor } from '../../models/sensors';
import { redis } from '../../services/redis';

const router = new (Router as any)();

router.get('/', async (req: any, res: { send: (arg0: any) => void; }) => {

    let result: any = await redis.get('sensors');

    // caching logic
    if (!result) {
        result = await Sensor.find();

        // 30 minutes cache for this call
        // sensor don't need a fast changing cache
        await redis.set('sensors', JSON.stringify(result), {
            EX: 1800,
            NX: true,
        })
        return res.send(result);
    }
    res.send(JSON.parse(result))
});



export default router;
