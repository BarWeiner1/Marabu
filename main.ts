import { Socket, createServer, connect } from "net" 
import canonicalize from 'canonicalize';

import peer from './peer'

const host = 'localhost';
const Net = require('net');
const port = 18018;
const router = require('./router');

let extractIP = (fullIP: string): [string, number] => {
    const regex: string = '((?::))(?:[0-9]+)$';
    let matchedArray: any = fullIP.match(regex);

    // No valid port extracted
    if (matchedArray == null) {
        throw new Error("Invalid IP: No port provided");
    }

    let port: string = matchedArray[0];
    let address: string = fullIP.slice(0,-port.length)

    return [address, Number(port.slice(1, port.length))]
}

let starter_nodes = [
    "144.202.103.247:18018",
    "149.28.220.241:18018",
    /*"149.28.204.235:18018",
    "139.162.130.195:18018"*/
]

// Create a new TCP server.
const server =  createServer()//new Net.Server()
router.initialiseDB();
    
type Connection = {
    handshakeSuccess: boolean;
    messageBuffer: string;
}

var connections: Map<string, Connection> = new Map();


server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});


server.on('connection', function(socket : Socket)  {
    console.log('A new connection has been established.');

    //socket.write('Hello, client.');
    // console.log(`${socket}`);
    
    console.log(`${socket.remoteAddress as string}`)
    new peer(socket.remoteAddress as string, socket.remotePort as number, socket)
})

let connectClient = (address: string, port: number): any => {
    var client: any = new Net.Socket();
    client.connect(port, address, function () {
        console.log(`Created new socket and sending hello to ${address}:${port}`);
        let helloMsg = router.writeHello();
        let getPeersMsg = router.sendGetPeers();
        router.sendMessages(client, [helloMsg, getPeersMsg])
    });
    client.on('data', function (chunk: any) {
        router.handleData(client, chunk.toString(), connections)
    });
    client.on('end', function () {
        console.log('disconnected from server');
    });
    client.on('error', function (err: String) {
        console.log(`Error: ${err}`);
    });
    return client
}

for(var ip of starter_nodes) {
    let address: string;
    let port: number;

    try {
        [address, port] = extractIP(ip);
    } catch (e) {
        // TODO: PRINT ERROR
        console.log("UNSUCCESSFUL IP:", ip)
        console.log(e);
        continue;
    }

    // Make a connection to client
    console.log(address, ":", port)
    try {
        connectClient(address, port);
    } catch (e) {
        console.log(e);
    }
}