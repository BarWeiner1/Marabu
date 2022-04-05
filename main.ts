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
   // console.log(`${socket}`);
    
    console.log(`${socket.remoteAddress.toString()}`)
    new peer(socket.remoteAddress, socket.remotePort, socket)
    
})