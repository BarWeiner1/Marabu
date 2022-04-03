//This is our server for Marabu

import { Socket, createServer, connect } from "net" 
import canonicalize from 'canonicalize';


const HelloMessage = {
   "type": "hello", 
    "version": "0.8.0", 
    "agent": "Marabu-Core Client 0.8" 
};

const error = { "type": "error", "error": "Unsupported message type received" };

const GetPeers = {"type": "getpeers"}

const port = 18018
const net = require('net');


class Server {
    constructor() {
        const newServ = net.createServer();
        newServ.listen(port);
       
        console.log(`Server listening for requests on socket localhost:${port}`);
        newServ.on('connection', (socket: Socket) => {
			new Client(socket.remoteAddress, socket.remotePort, socket)
		})

    }
}

class Client {

    private port: number
    private host: string
    private socket: Socket

    constructor(host: string, port: number, socket?: Socket) {
        this.host = host;
        this.port = port;
        this.socket = socket;
    }

    handleMessage = {

    }

    



}




