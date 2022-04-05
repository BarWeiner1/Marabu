import {Socket, connect} from "net"
const Net = require('net');
const port = 18018;

type Connection = {
    handshakeSuccess: boolean;
    messageBuffer: string;
}
var connections: Map<string, Connection> = new Map();
const router = require('./router');

export default class peer{
    private socket: Socket
    private host: string
    private port: number
    private cache: Buffer = Buffer.alloc(0)


constructor(host: string, port: number, socket? : Socket){
    this.host = host
    this.port = port
    this.socket = socket || connect(this.port, this.host)
    this.socket.on('info', a => this.fillBuffer(a))
    console.log('blockchain');

}

    
private fillBuffer(buffer: Buffer) {


    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    //this.socket.write('Hello, client.');

       // The server can also receive data from the client by reading from its socket.
    
    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    router.writeHello(this.socket);
    connections.set(this.socket.remoteAddress + ":" + this.socket.remotePort, {
        handshakeSuccess: false,
        messageBuffer: "",
    });
    this.socket.on('data', (chunk: Buffer) => {
        router.handleData(this.socket, chunk, connections);
    });
    this.socket.on('end', () =>  {
        // Remove connection from K:V store
        connections.delete(this.socket.remoteAddress + ":" + this.socket.remotePort); 
        console.log(`Connection with node ${this.socket.remoteAddress}:${this.socket.remotePort} ended`);
    });
    this.socket.on('error', (err: String) => {
        console.log(`Error: ${err}`);
    });
    


}


}

/*const client = new Net.Socket();
client.connect({ port: port, host: host }), function() {
    // If there is no error, the server has accepted the request and created a new 
    // socket dedicated to us.
    console.log('TCP connection established with the server.');

    // The client can now send data to the server by writing to its socket.
    client.write('Hello, server.');
};

// The client can also receive data from the server by reading from its socket.
client.on('data', function(address: string, port: number) {
    console.log(`Data received from the server: ${address.toString()}.`);
    
    // Request an end to the connection after the data has been received.
    client.end();
});

client.on('end', function() {
    console.log('Requested an end to the TCP connection');
});*/


