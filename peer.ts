import {Socket, connect} from "net"
const Net = require('net');
const port = 18018;

export default class peer{
    private socket: Socket
    private host: string
    private port: number
    private cache: Buffer = Buffer.alloc(0)


constructor(host: string, port: number, socket? : Socket){
    this.host = host
    this.port = port
    this.socket = socket 
    this.socket.on('info', a => this.fillBuffer(a))
    console.log('blockchain');

}
    
private fillBuffer(buffer: Buffer) {
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    this.socket.write('Hello, client.');

       // The server can also receive data from the client by reading from its socket.
    this.socket.on('data', function(chunk: Buffer) {
        console.log('Data received from client: ${chunk.toString()');
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    this.socket.on('end', function() {
        console.log('Closing connection with the client');
    });
   
     this.socket.on('error', function (err: String) {
         console.log(`Error: ${err}`);
    });


}


}

const client = new Net.Socket();
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
});


