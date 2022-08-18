import { Router } from 'express';
import { Sensor } from '../../models/sensors';

const router = new (Router as any)();

router.get('/', async (req: any, res: { send: (arg0: any) => void; }) => {
    const sensors = await Sensor.find();
    res.send(sensors)
});



export default router;
