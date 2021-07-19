const express = require('express');
const path = require('path');
const moment = require("moment");
const method = require('./methods/method')
const database = require('./database/database');
const WebSocket = require("ws");

//Create Express object and connect to database
const app = express();
database.sequelize.sync();

const filepath = path.join(__dirname, '../client/build/');
console.log('path: ' + filepath);

//Create Websocket
var wss = new WebSocket.Server({ port: 4001 });
wss.on("connection", function connection(req) {
  console.log('connection');
});

setInterval(function () {
  database.asset.findAll({
    include: [{
      model: database.operating_system, as: 'o',
      attributes: ['name', 'build']
    },
    {
      model: database.workgroup, as: 'workgroup',
      attributes: ['name']
    },
    {
      model: database.domain, as: 'domain',
      attributes: ['name']
    },
    {
      model: database.status, as: 'statuses',
      attributes: ['status']
    }],
    order: [['id', 'asc']]
  }).then((assets) => wss.clients.forEach(function (client) {
    client.send(JSON.stringify(assets));
  }));
  
}, 30000);

//Debug Middeware
app.use((req, res, next) => {
  console.log('Debug Middleware: ' + req.path);
  next();
});

//Apply Midleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(filepath, { index: false }));

//Serve client side
app.get('/', (req, res) => {
  res.sendFile(filepath + 'index.html');
  console.log('Sent index.html');
})

//API requests
app.get('/assets', method.getAssets);

app.get('/asset/:assetID', method.getAssetHistory);

app.listen(4000);