const WebSocket = require("ws");
//Create Websocket
module.exports = {
    wss: new WebSocket.Server({ port: 4001 })
}