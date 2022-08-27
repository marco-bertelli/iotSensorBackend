import { Router } from 'express';
import { dataLogRepository } from '../../services/redis';
import { actualDataAggregation, humidityAverageAggregate, temperatureAverageAggregate } from './aggregations';
import { DataLog } from '../../models/datalogs';

const tf = require('@tensorflow/tfjs-node')

import moment from 'moment';

const router = new (Router as any)();

router.get('/predict', async ({ params: { sensorId } }: any, res: { send: (arg0: any) => void; }) => {
    const nextHour = moment().add(1, 'hours').unix()
    const humidity = Number(80);

    const handler = tf.io.fileSystem(__dirname + "/../../tensorflow/model.json");
    const model = await tf.loadLayersModel(handler);

    const tensor = tf.tensor([[Number(nextHour), Number(humidity)]])

    const prediction = await model.predict(tensor)
    const values = prediction.dataSync();

    res.send(values)
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
