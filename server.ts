//This is our server for Marabu

import { Socket, createServer, connect } from "net" 
import * as stringify from 'canonical-json'




const port = 18018
const Net = require('net');


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


    constructor(host: string, port: number, socket?: socket) {
        this.host = host;
        this.port = port;

        this.socket = socket;
    }

}




