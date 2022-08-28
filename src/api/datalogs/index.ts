import { Router } from 'express';
import { dataLogRepository, redis } from '../../services/redis';
import { actualDataAggregation, humidityAverageAggregate, temperatureAverageAggregate } from './aggregations';
import { DataLog } from '../../models/datalogs';

const tf = require('@tensorflow/tfjs-node')

import moment from 'moment';

const router = new (Router as any)();

router.get('/predict', async ({ params: { sensorId } }: any, res: { send: (arg0: any) => void; }) => {
    let result: any = await redis.get('prediction');

    // caching logic
    if (!result) {
        const nextHour = moment().add(1, 'hours').unix()
        const humidity = Number(80);
    
        const handler = tf.io.fileSystem(__dirname + "/../../../tensorflow/model.json");
        const model = await tf.loadLayersModel(handler);
    
        const tensor = tf.tensor([[Number(nextHour), Number(humidity)]])
    
        const prediction = await model.predict(tensor)
        result = prediction.dataSync();

        // 15 minutes cache for this call
        // predictions don't need a fast changing cache
        await redis.set('prediction', JSON.stringify(result), {
            EX: 900,
            NX: true,
        })
        return res.send(result);
    }

    res.send(JSON.parse(result))
});

router.get('/ambient/now', async (req: any, res: { send: (arg0: any) => void; }) => {
    const start = moment().startOf('day').unix()
    const end = moment().endOf('day').unix()

    const actualData: any = await DataLog.aggregate(actualDataAggregation(start, end))

    res.send(actualData ? actualData[0] : null)
});

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

router.get('/ambient/temperature/:interval', async ({ params: { interval } }: any, res: { send: (arg0: any) => void; }) => {
    const lastHour = moment().subtract(Number(interval), 'hours').unix()
    const now = moment().unix()

    const average: any = await DataLog.aggregate(temperatureAverageAggregate(lastHour, now))

    res.send(average ? average[0] : null)
});


export default router;
