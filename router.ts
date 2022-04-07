import level from 'level-ts';
import canonicalize from 'canonicalize';
import { createConnection } from 'net';
import { type } from 'os';

type Connection = {
    handshakeSuccess: boolean;
    messageBuffer: string;
}

const error = { "type": "error", "error": "Unsupported message type received" };

const HelloMessage = {
    "type": "hello", 
     "version": "0.8.0", 
     "agent": "Albatross" 
 };

 const GetPeers = {"type": "getpeers"}

 const peers = new level('./database');

 let starter_nodes = [
    "149.28.220.241:18018",
    /*"149.28.204.235:18018",
    "139.162.130.195:18018"*/
]

 export let initialiseDB = async function (DB: any) {
     if (!(await peers.exists("numPeers"))) {
         console.log("RESET")
         await peers.put("peers", JSON.stringify(starter_nodes));
         await peers.put("numPeers", starter_nodes.length);
     }
 };

 export let writeError = () => {
    let errorString = error;
    return errorString;
}

export let writeHello = () => {
    let helloRaw = HelloMessage;
    return helloRaw;
}

export let sendGetPeers = () => {
    let getPeersString = GetPeers;
    return getPeersString;
}

export let handleData = async (socket: any, chunk: Buffer, connections: any) => {
    //console.log(`recievedData: ${chunk.toString()}`);
    // Decode message
    //console.log("recieved 1 " + chunk.toString());
    let decodedChunk: any;
    try {
        decodedChunk = JSON.parse(chunk.toString());
    } catch (error) {
        
        sendMessages(socket, [writeError()]);
        return
    }

    // if (decodedChunk.version != "0.8.0") {
    //     socket.write(writeError());
    // }

    let remoteEndpoint: string = `${socket.remoteAddress}:${socket.remotePort}`

    let connectSet: Connection = {
        handshakeSuccess : false,
        messageBuffer : decodedChunk
    }

    // Get connection from k:v store
    console.log(connections + "print" + connectSet);
     if (connections.get(remoteEndpoint) == undefined) {
         
        connectSet.handshakeSuccess = false;
        connectSet.messageBuffer = decodedChunk;

        connections.set(remoteEndpoint, connectSet);
        console.log(connections + "print1" + connectSet);
    }
    else{

        connectSet.messageBuffer += decodedChunk;

        connections.set(remoteEndpoint, connectSet);

    }

    console.log("print2" + connectSet.messageBuffer);    

   
    // if (!connections.handshakeSuccess && decodedChunk.type != "hello") {
       
    //     socket.write(writeError());
    // }

    // Handle Data
    switch (decodedChunk.type) {
        case "hello": {
            
            console.log("hello");
            connectSet.handshakeSuccess = true;
            connections.set(remoteEndpoint, connectSet);
            
            break;
        }
        case "getpeers": {
            console.log("getPeers");
            var index = await peers.get('numPeers');
            var peersMessage = [];
            for (var i = 0; i < index; i++) {
                peersMessage[i] = await peers.get(i.toString());
            }
            sendMessages(socket, peersMessage);
            break;
        }
        case "peers": {
            console.log("peers");
            var index = await peers.get('numPeers');
            for (let peer of decodedChunk.peers) {
                await peers.put(index, {value : peer});
                index = index + 1;
            }
            await peers.put('numPeers', {value : index});
            //add to a database
            break;
        }
        case "error": {
            console.log("Got error message");
            break;
        }
        default: {
            sendMessages(socket, [writeError()]);
            break;
        }
    }    
}

//sendMessages will take any array of strings and send it out to the specified socket
export let sendMessages = (socket : any, messages: any[]) => {
    let sendOut = new String("");
    for (let m of messages){
        sendOut += canonicalize(m) + '\n';
    }
    console.log("Sent out message:" + sendOut );
    socket.write(sendOut);
}


