
const error = { "type": "error", "error": "Unsupported message type received" };

const HelloMessage = {
    "type": "hello", 
     "version": "0.8.0", 
     "agent": "Marabu-Core Client 0.8" 
 };

 const GetPeers = {"type": "getpeers"}

 export let writeError = () => {
    let errorString = JSON.stringify(error);
    return errorString;
}

export let writeHello = () => {
    let helloRaw = JSON.stringify(HelloMessage);
    return helloRaw;
}

export let sendGetPeers = () => {
    let getPeersString = JSON.stringify(GetPeers);
    return getPeersString;
}

export let handleData = (socket: any, chunk: Buffer, connections: any) => {
    // Decode message
    let decodedChunk: any;
    try {
        decodedChunk = JSON.parse(chunk.toString());
    } catch (error) {
        socket.write(writeError());
        return
    }


    if (decodedChunk.version != "0.8.0") {
        socket.write(writeError());
    }

    let remoteEndpoint: string = `${socket.remoteAddress}:${socket.remotePort}`

    // Get connection from k:v store
    var connection = connections.get(remoteEndpoint);
    if (connection === undefined) {
        socket.write(writeError());
        return
    }
    
    if (!connection.handshakeSuccess && decodedChunk.type != "hello") {
        socket.write(writeError());
    }

    // Handle Data
    switch (decodedChunk.type) {
        case "hello": {
            connection.handshakeSuccess = true;
            connections.set(remoteEndpoint, connection);
            break;
        }
        case "getpeers": {
        //     var index = await peersDB.get('numPeers');
        //     var peersMessage = [];
        //     for (var i = 0; i < index; i++) {
        //         peersMessage[i] = await peersDB.get(i.toString());
        //     }
        //     sendMessages(socket, peersMessage);
        //     break;
        // }
        // case "peers": {
        //     var index = await peersDB.get('numPeers');
        //     for (let peer of decodedChunk.peers) {
        //         await peersDB.put(index, {value : peer});
        //         index = index + 1;
        //     }
        //     await peersDB.put('numPeers', {value : index});
        //     //add to a database
            break;
        }
        default: {
            socket.write(writeError());
            break;
        }
    }    
}