const db = require("../../database/database");
const websocket = require('../../ws/ws');
const { Client } = require('ssh2');
var Netmask = require('netmask').Netmask
const util = require('util');
const fs = require('fs');
const { resolve } = require("path");
const { exec } = require('child_process');

//No. of cycles to do a complete scan(icmp + arp + DC Query)
const Period = 5;
//Other times only icmp
const Interval = 30000;
var setupDone = false;
const conn = new Client();
var setupConfig = null;
var globalres;
var commands = null;
var Hosts = null;
var count = 0;
var cycle = 0;

function getMac(i, j, mode) {
    return (ips, num) => new Promise((resolve, reject) => {
        var arpCache;

        if (num === 3) arpCache = util.format("arp -n | grep '%s\\|%s\\|%s' | sed 's/|/ /' | awk '$3 ~ /^[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]/ {print $1, $3}' | sort -V",
            '' + i + '.' + j + '.' + commands[0][1],
            '' + i + '.' + j + '.' + commands[1][1],
            '' + i + '.' + j + '.' + commands[2][1]);

        else if (num === 2) arpCache = util.format("arp -n | grep '%s\\|%s' | sed 's/|/ /' | awk '$3 ~ /^[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]/ {print $1, $3}' | sort -V",
            '' + i + '.' + j + '.' + commands[0][1],
            '' + i + '.' + j + '.' + commands[1][1]);

        else if (num === 1) arpCache = util.format("arp -n | grep '%s' | sed 's/|/ /' | awk '$3 ~ /^[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]:[a-f0-9][a-f0-9]/ {print $1, $3}' | sort -V",
            '' + i + '.' + j + '.' + commands[0][1]);

        if (mode) {
            //SSH Command
            conn.exec(arpCache, (err, stream) => {
                if (err) throw err;
                var macs = ''
                stream.on('close', (code, signal) => {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                    macs = macs.split('\n');
                    macs = macs.map((ip_mac) => ip_mac.split(' '));
                    resolve({ ips, macs });
                });

                stream.on('data', (data) => {
                    // console.log('STDOUT: ');
                    macs = macs + data;
                });

                stream.stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            });
        }
        else {
            console.log('exec - ', commands[index][0]);
            exec(commands[index][0], (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                stdout = stdout.split('\n');
                stdout = stdout.map((ip_mac) => ip_mac.split(' '));
                resolve(stdout);
            })
        }
    });
}

function pingSweep(index, mode) {
    return new Promise((resolve, reject) => {
        if (mode) {
            conn.exec(commands[index][0], (err, stream) => {
                if (err) throw err;
                var ips = '';
                stream.on('close', (code, signal) => {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                    ips = ips.split(':\n');
                    resolve(ips);
                });

                stream.on('data', (data) => {
                    // console.log('STDOUT');
                    ips = ips + data;
                });

                stream.stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            });
        }
        else {
            console.log('exec - ', commands[index][0]);
            exec(commands[index][0], (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                stdout = stdout.split(':\n');
                resolve(stdout);
            })
        }
    });
}

Wait = (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    })
};

Scan = (mode) => {
    return new Promise((resolve) => {
        setupConfig.subnets.map(async function loop(subnet) {
            count = 0;
            var i_max = subnet.stop_ip[0];
            var j_max = (subnet.start_ip[0] === subnet.stop_ip[0]) ? subnet.stop_ip[1] : 255;
            var k_max = (subnet.start_ip[1] === subnet.stop_ip[1]) ? subnet.stop_ip[2] : 255;
            for (var i = subnet.start_ip[0]; i <= i_max; i++) {
                for (var j = subnet.start_ip[1]; j <= j_max; j++) {
                    commands = [[], [], []];
                    for (var k = subnet.start_ip[2]; k <= k_max; k++) {

                        if (i === subnet.stop_ip[0] && j === subnet.stop_ip[1] && k === subnet.stop_ip[2]) {
                            commands[count][0] = util.format('for l in {%s..%s}; do ping -c 1 -W 0.2 -s 1 %s.%s.%s.${l}; done | grep "bytes from" | sed \'s/\|/ /\' | awk \'{print $4}\'',
                                (subnet.bitmask > 24) ? subnet.start_ip[3] : 0,
                                subnet.stop_ip[3],
                                i,
                                j,
                                k
                            );
                            commands[count++][1] = k;
                            i = i_max;
                            j = j_max;
                            k = k_max;
                        }
                        else {
                            commands[count][0] = util.format('for l in {%s..%s}; do ping -c 1 -W 0.2 -s 1 %s.%s.%s.${l}; done | grep "bytes from" | sed \'s/\|/ /\' | awk \'{print $4}\'',
                                (subnet.bitmask > 24) ? subnet.start_ip[3] : 0,
                                255,
                                i,
                                j,
                                k
                            );
                            commands[count++][1] = k;
                        }

                        //console.log(commands[count - 1]);

                        if (count % 3 === 0 && count != 0) {
                            await Promise.all(
                                [
                                    pingSweep(count - 3, mode),
                                    pingSweep(count - 2, mode),
                                    pingSweep(count - 1, mode)
                                ]).then(async (ips) => {
                                    if (cycle === 0) {
                                        await getMac(i, j, mode)(ips, 3).then(({ ips, macs }) => {
                                            Hosts[0] = Hosts[0].concat(ips); Hosts[1] = Hosts[1].concat(macs)
                                        })
                                    }
                                    else {
                                        Hosts[0] = Hosts[0].concat(ips);
                                    }
                                })
                            count = 0;
                        }
                        else if (i === i_max && j === j_max && k === k_max && count != 0) {
                            if (count == 2) {
                                await Promise.all(
                                    [
                                        pingSweep(count - 2, mode),
                                        pingSweep(count - 1, mode)
                                    ]).then(async (ips) => {
                                        if (cycle === 0) {
                                            await getMac(i, j, mode)(ips, 2).then(({ ips, macs }) => {
                                                Hosts[0] = Hosts[0].concat(ips); Hosts[1] = Hosts[1].concat(macs)
                                            })
                                        }
                                        else {
                                            Hosts[0] = Hosts[0].concat(ips);
                                        }
                                    })
                            }
                            else {
                                await Promise.all([pingSweep(count - 1, mode)]).then(async (ips) => {
                                    if (cycle === 0) {
                                        await getMac(i, j, mode)(ips, 1).then(({ ips, macs }) => {
                                            Hosts[0] = Hosts[0].concat(ips); Hosts[1] = Hosts[1].concat(macs)
                                        })
                                    }
                                    else {
                                        Hosts[0] = Hosts[0].concat(ips);
                                    }
                                })
                            }
                        }
                        // console.log('next loop');
                    }
                }
            }

            if (cycle === 0) {
                //Get Domain, Workgroup, OS

            };

            //Refactor Info and add to Hosts[]
            console.log(Hosts);

            //Update DB

            resolve('');
        });
    })
};

ScanNReport = (mode) => {
    return new Promise(async (resolve) => {
        Hosts = [[], []];

        await Scan(mode);

        if (websocket.wss.clients) {

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

        cycle = (cycle + 1) % Period;
        resolve('');
    })
};

WebSockLoop = async (mode) => {
    while (1) {
        await ScanNReport(mode);
        await Wait(Interval);
    }
}

localConnect = (setupConfig, res) => {
    setupDone = true;

    setupConfig.subnets = setupConfig.target.map((target) => {
        try {
            target = target.replace(/\s/g, '');
            var subnet = new Netmask(target);
            subnet.start_ip = subnet.first.split('.');
            subnet.stop_ip = subnet.broadcast.split('.');
            subnet.start_ip = subnet.start_ip.map((text) => Number(text));
            subnet.stop_ip = subnet.stop_ip.map((text) => Number(text));
            return subnet;
        }
        catch (err) {
            console.log('error', err);
        }
        return;
    });

    console.log(setupConfig.subnets);

    //Websocket Loop
    WebSockLoop(false);

}

//Ready Event
conn.on('ready', () => {
    console.log('\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');

    setupDone = true;

    setupConfig.subnets = setupConfig.target.map((target) => {
        try {
            target = target.replace(/\s/g, '');
            var subnet = new Netmask(target);
            subnet.start_ip = subnet.first.split('.');
            subnet.stop_ip = subnet.broadcast.split('.');
            subnet.start_ip = subnet.start_ip.map((text) => Number(text));
            subnet.stop_ip = subnet.stop_ip.map((text) => Number(text));
            return subnet;
        }
        catch (err) {
            console.log('error', err);
        }
        return;
    });

    console.log(setupConfig.subnets);

    //Websocket Loop
    WebSockLoop(true);

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
        if (setupConfig.remote) {
            sshConnect(setupConfig, res);
        }
        else {
            localConnect(setupConfig, res);
        }
    }
    else {
        return res.status('200').json({ status: '200' });
    }
    return;
}

module.exports = setup;