import { Router } from 'express';
import { dataLogRepository } from '../../services/redis';
import moment from 'moment';

const router = new (Router as any)();

router.get('/:sensorId/:interval', async ({ params: { sensorId, interval } }: any, res: { send: (arg0: any) => void; }) => {
    const lastHour = moment().subtract(Number(interval), 'hours').unix()
    const now = moment().unix()
    
    const points = await dataLogRepository
    .search()
    .where('sensorId')
    .equals(sensorId)
    .where('timestamp')
    .between(lastHour, now)
    .sortAscending('timestamp')
    .return.all()

    res.send(points)
});



export default router;