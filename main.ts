import { Socket, createServer, connect } from "net" 
import canonicalize from 'canonicalize';
import peer from './peer'


const host = 'localhost';
const Net = require('net');
const port = 18018;


// Create a new TCP server.
const server = new Net.Server()



server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});



server.on('connection', function(socket : Socket) {
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    socket.write('Hello, client.');
    console.log(`${socket}`);

    new peer(socket.remoteAddress, socket.remotePort, socket)
    
});


//Create a new client
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

//Go to peer class to communicate through socket

