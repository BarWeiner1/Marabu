import { Socket, createServer, connect } from "net" 
import canonicalize from 'canonicalize';

// Include Nodejs' net module.
const Net = require('net');
// The port on which the server is listening.
const port = 18018;

// Create a new TCP server.
const server = new Net.Server();
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.


server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket : any) {
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    socket.write('Hello, client.');

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk: Buffer) {
        console.log('Data received from client: ${chunk.toString()');
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });
   
     socket.on('error', function (err: String) {
         console.log(`Error: ${err}`);
    });
});

