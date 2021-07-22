const db = require("../../database/database");
const websocket = require('../../ws/ws');
const { Client } = require('ssh2');

var setupDone = false;
const conn = new Client();

sshConnect = (creds) => {

    conn.on('ready', () => {
        console.log('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
        conn.exec('whoami', (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
            });

            stream.on('data', (data) => {
                console.log('STDOUT: ' + data);
            });

            stream.stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    });

    conn.on('close', () => {
        console.log('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
    });

    conn.on('error', (err) => {
        console.log('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
    });

    conn.connect({
        host: creds.server,
        port: (creds.port) ? creds.port : 22,
        username: creds.username,
        password: creds.password
    });
    return;
}

setup = (req, res) => {
    console.log('setup', req.body);
    if (!setupDone) {
        //Create SSH Connection
        sshConnect(req.body);

        //Websocket Loop
        setInterval(function () {
            if (websocket.wss.clients) {
                db.asset.findAll({
                    include: [{
                        model: db.operating_system, as: 'o',
                        attributes: ['name', 'build']
                    },
                    {
                        model: db.workgroup, as: 'workgroup',
                        attributes: ['name']
                    },
                    {
                        model: db.domain, as: 'domain',
                        attributes: ['name']
                    },
                    {
                        model: db.status, as: 'statuses',
                        attributes: ['status']
                    }],
                    order: [['id', 'asc']]
                }).then((assets) => websocket.wss.clients.forEach(function (client) {
                    client.send(JSON.stringify(assets));
                }));
            }
        }, 30000);
    }
    return res.status('200').json({ status: '200' });
}

module.exports = setup;