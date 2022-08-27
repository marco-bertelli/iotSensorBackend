import { Router } from 'express';
import { Alarm } from '../../models/alarms';
import { redis } from '../../services/redis';

const router = new (Router as any)();

router.get('/active', async (req: any, res: { send: (arg0: any) => void; }) => {
    const activeAlarms = await Alarm.find({ type: 'active' });
    res.send(activeAlarms)
});

router.get('/finished', async (req: any, res: { send: (arg0: any) => void; }) => {
    let result: any = await redis.get('finishedAlarms');

    // caching logic
    if (!result) {
        result = await Alarm.find({ type: 'finish' }).sort({startDate: -1}).limit(4);

        // 3 minutes cache for this call
        await redis.set('finishedAlarms', JSON.stringify(result), {
            EX: 180,
            NX: true,
        })
        return res.send(result);
    }
    res.send(JSON.parse(result))
});

export default router;
