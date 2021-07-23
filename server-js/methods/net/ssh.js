const db = require("../../database/database");
const websocket = require('../../ws/ws');
const { Client } = require('ssh2');
var Netmask = require('netmask').Netmask

var setupDone = false;
const conn = new Client();
var setupConfig = null;
var globalres;

//Ready Event
conn.on('ready', () => {
    console.log('\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');

    setupDone = true;

    var subnets = setupConfig.target.map((target) => {
        try {
            target = target.replace(/\s/g, '');
            var subnet = new Netmask(target);
            return subnet;
        }
        catch (err) {
            console.log('error', err);
        }
        return;
    });

    console.log(subnets);

    //Websocket Loop
    setInterval(function () {
        if (websocket.wss.clients) {

            //SSH Command
            // conn.exec('for i in {1..255}; do (ping -c 1 10.0.0.${i} | grep "bytes from" &); done', (err, stream) => {
            //     if (err) throw err;
            //     stream.on('close', (code, signal) => {
            //         console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            //     });

            //     stream.on('data', (data) => {
            //         console.log('STDOUT: ' + data);
            //     });

            //     stream.stderr.on('data', (data) => {
            //         console.log('STDERR: ' + data);
            //     });
            // });

            //DB Query
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

    if (globalres) {
        globalres.status('200').json({ status: '200' });
        globalres = null;
    }
    return;
});

//Close Event
conn.on('close', () => {
    console.log('\r\n*** SSH CONNECTION CLOSED ***\r\n');
});

//Error Event
conn.on('error', (err) => {
    console.log('\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');

    if (globalres) {
        globalres.status('500').json({});
        globalres = null;
    }
    return;
});

sshConnect = (creds) => {
    //Connect
    conn.connect({
        host: creds.server,
        port: (creds.port) ? creds.port : 22,
        username: creds.username,
        password: creds.password
    });
    return true;
}

//to end conn.end();

setup = (req, res) => {
    console.log('setup', req.body);

    //globalres
    globalres = res;

    if (!setupDone) {
        //Save config
        setupConfig = req.body;

        //Create SSH Connection
        sshConnect(setupConfig, res);
    }
    else {
        return res.status('200').json({ status: '200' });
    }
    return;
}

module.exports = setup;