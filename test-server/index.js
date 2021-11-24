const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 24000 }, () => {
    console.log("Signalling server is now listening on port 24000");
});

const clients = {};

wss.broadcast = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', ws => {
    console.log(`Client connected. Total connected clients: ${wss.clients.size}`);

    ws.on('message', message => {
        msg = JSON.parse(message);
        console.log(message + "\n\n");
        // wss.broadcast(ws, message.toString('utf-8'));

        switch (msg.type) {
            case 'setName':
                ws._name = msg.data;
                clients[msg.data] = ws;
                break;

            case 'setCall':
                ws._call = clients[msg.data];
                if (ws._call) {
                    ws._call._call = ws;
                }
                break;
        }

        if (ws._call) {
            ws._call.send(message.toString('utf-8'));
        }
    });

    ws.on('close', wso => {
        console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`);
        if (ws._call) {
            ws._call._call = null;
            ws._call = null;
            delete clients[ws._name];
        }
    })

    ws.on('error', error => {
        console.log(`Client error. Total connected clients: ${wss.clients.size}`);
    });
});