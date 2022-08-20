import { Alarm } from '../../models/alarms';
import jsonLogic from 'json-logic-js';

export async function checkRule(value: Number, rule: any, sensorId: any, ruleId: any, ruleName: string) {
    const ruleData = { "temp": value };

    const result = jsonLogic.apply(rule, ruleData);
    const activeAlarm = await Alarm.findOne({ type: 'active', sensorId: sensorId, ruleId: ruleId})

    if(!result && !activeAlarm) {
        return;
    }

    if(!result && activeAlarm) {
        activeAlarm.type = 'finish';
        activeAlarm.detriggerValue = value;
        activeAlarm.finishDate = new Date();

        return await activeAlarm.save();
    }

    if (result && activeAlarm) {
        return;
    }

    return await Alarm.create({
        ruleId: ruleId,
        startDate: new Date(),
        sensorId: sensorId,
        triggerValue: value,
        type: 'active',
        name: ruleName,
    })
}