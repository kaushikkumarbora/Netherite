const express = require('express');
const path = require('path');
const moment = require("moment");
const method = require('./methods/method')
const database = require('./database/database');
const websocket = require('./ws/ws');

//Create Express object and connect to database
const app = express();
database.sequelize.sync();

const filepath = path.join(__dirname, '../client/build/');
console.log('path: ' + filepath);

websocket.wss.on("connection", function connection(req) {
  console.log('connection');
});

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

app.post('/setup', method.setup);

app.listen(4000);