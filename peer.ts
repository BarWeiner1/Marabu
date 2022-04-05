import {Socket, connect} from "net"


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

