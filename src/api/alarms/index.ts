import { Router } from 'express';
import { Alarm } from '../../models/alarms';

const router = new (Router as any)();

router.get('/active', async (req: any, res: { send: (arg0: any) => void; }) => {
    const activeAlarms = await Alarm.find({ type: 'active' });
    res.send(activeAlarms)
});

export default router;
