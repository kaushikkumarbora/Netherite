const db = require("../../database/database");
const websocket = require('../../ws/ws');

var setupDone = false;

sshConnect = (creds) => {
    return;
}

setup = (req, res) => {
    console.log('setup', req.body);
    if (!setupDone) {
        sshConnect(req.body);
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