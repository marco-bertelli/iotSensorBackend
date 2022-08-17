import config from '../../config';

const fs = require('fs');
const http = require('https');
const os = require('os');

// get info from settings
const {secretMasterName, secretMasterUrl} = config;

// this part check if the server has the master cert or download it from the remote secure source

export function checkMasterCertificate() {
    return new Promise((resolve, reject) => {
        try {
            const file = fs.readFileSync(`${os.tmpdir()}/${secretMasterName}.pem.crt`);
            resolve();
        } catch (err) {
            const finishedActions = [];

            const cert = fs.createWriteStream(`${os.tmpdir()}/${secretMasterName}.certificate.pem.crt`);
            const privateKey = fs.createWriteStream(`${os.tmpdir()}/${secretMasterName}.private.pem.key`);
            const amazonRoot = fs.createWriteStream(`${os.tmpdir()}/AmazonRootCA1.pem`)

            http.get(`${secretMasterUrl}/${secretMasterName}.certificate.pem.crt`, function (response: { pipe: (arg0: any) => void; }) {
                response.pipe(cert);
            });

            http.get(`${secretMasterUrl}/${secretMasterName}.private.pem.key`, function (response: { pipe: (arg0: any) => void; }) {
                response.pipe(privateKey);
            });

            http.get(`${secretMasterUrl}/AmazonRootCA1.pem`, function (response: { pipe: (arg0: any) => void; }) {
                response.pipe(amazonRoot);
            });

            cert.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve();
                }
            });

            cert.on('error', function () {
                reject();
            });

            amazonRoot.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve();
                }
            });

            amazonRoot.on('error', function () {
                reject();
            });

            privateKey.on('finish', function () {
                finishedActions.push(true)

                if (finishedActions.length === 3) {
                    resolve();
                }
            });

            privateKey.on('error', function () {
                reject();
            });
        }
    });
}

