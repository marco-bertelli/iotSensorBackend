import { Router } from 'express';
import { dataLogRepository } from '../../services/redis';
import { humidityAverageAggregate } from './aggregations';
import { DataLog } from '../../models/datalogs';

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

router.get('/ambient/humidity/:interval', async ({ params: { interval } }: any, res: { send: (arg0: any) => void; }) => {
    const lastHour = moment().subtract(Number(interval), 'hours').unix()
    const now = moment().unix()

    const average: any = await DataLog.aggregate(humidityAverageAggregate(lastHour, now))

    res.send(average ? average[0] : null)
});



export default router;
