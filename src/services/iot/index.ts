import config from '../../config';
import logger from '../logger/index';

const awsIot = require('aws-iot-device-sdk');
const AWS = require('aws-sdk');
const secretMasterName = config.secretMasterName;
const host = config.host;

const os = require('os');

AWS.config.update({ region: 'eu-central-1' });

const iot = new AWS.Iot();

interface Thing { iotCode: any; clientId: { toString: () => any; }; type: any; certificateArn: any }

let device: any;

export function initDevice() {
    device = awsIot.device({
        keyPath: `${os.tmpdir()}/${secretMasterName}.private.pem.key`,
        certPath: `${os.tmpdir()}/${secretMasterName}.certificate.pem.crt`,
        caPath: `${os.tmpdir()}/AmazonRootCA1.pem`,
        host: host
    });


    device.on('connect', function () {
        logger.info('system connected to aws iot...');
        device.subscribe('machines');
        logger.info('mqtt parser ready...');
    });

    device.on('error', function (e: any) {
        logger.info({ e });
    });

    device.on('message', function (topic: string, payload: { toString: () => any; }) {
        logger.info('message received');
        parser(payload.toString());
    });
}

export function createThing(thing: Thing) {

    let params = {
        thingName: thing.iotCode,
        attributePayload: {
            attributes: {
                clientId: thing.clientId.toString(),
                laiType: thing.type,
                billingGroupName: 'lai'
            }
        }
    };
    const promise = new Promise((resolve, reject) => {
        iot.createThing(params, function (err: any, data: unknown) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

export async function deleteThing(thing: Thing) {
    logger.warn('init deleting a thing from AWS');

    if (!thing.iotCode) {
        throw new Error('unable to delete from AWS without iotCode');
    }

    await detachPolicy(thing);
    await detachThingPrincipal(thing);
    await UpdateCertificate(thing);
    await DeleteCertificate(thing);
    await DeleteThing(thing);

    return;
}

function detachPolicy(thing: Thing) {

    let params = {
        policyName: 'machine',
        target: thing.certificateArn
    };

    const promise = new Promise((resolve, reject) => {
        iot.detachPolicy(params, function (err: any, data: unknown) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function detachThingPrincipal(thing: Thing) {

    let params = {
        thingName: thing.iotCode,
        principal: thing.certificateArn
    };

    const promise = new Promise((resolve, reject) => {
        iot.detachThingPrincipal(params, function (err: any, data: unknown) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function UpdateCertificate(thing: Thing) {

    const certificateId = thing.certificateArn.split('/')[1];
    let params = {
        certificateId: certificateId,
        newStatus: 'INACTIVE'
    };

    const promise = new Promise((resolve, reject) => {
        iot.updateCertificate(params, function (err: any, data: unknown) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function DeleteCertificate(thing: Thing) {

    const certificateId = thing.certificateArn.split('/')[1];

    let params = {
        certificateId: certificateId,
    };

    const promise = new Promise((resolve, reject) => {
        iot.deleteCertificate(params, function (err: any, data: unknown) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function DeleteThing(thing: Thing) {

    let params = {
        thingName: thing.iotCode,
    };

    const promise = new Promise((resolve, reject) => {
        iot.deleteThing(params, function (err: any, data: unknown) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

    return promise;
}

function parser(message: any) {
    let objectMessage;
    try {
        objectMessage = JSON.parse(message);
    } catch (err) {
        logger.error(`error parsing message: ${message}`);
    }

    // TODO save the received message
    // DataLog.addMessage(objectMessage);
}
