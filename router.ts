import level from 'level-ts';
import canonicalize from 'canonicalize';
const error = { "type": "error", "error": "Unsupported message type received" };

const HelloMessage = {
    "type": "hello", 
     "version": "0.8.0", 
     "agent": "Marabu-Core Client 0.8" 
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

export let handleData = async (socket: any, chunk: Buffer, connections: any) => {
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
            var index = await peers.get('numPeers');
            var peersMessage = [];
            for (var i = 0; i < index; i++) {
                peersMessage[i] = await peers.get(i.toString());
            }
            sendMessages(socket, peersMessage);
            break;
        }
        case "peers": {
            var index = await peers.get('numPeers');
            for (let peer of decodedChunk.peers) {
                await peers.put(index, {value : peer});
                index = index + 1;
            }
            await peers.put('numPeers', {value : index});
            //add to a database
            break;
        }
        default: {
            socket.write(writeError());
            break;
        }
    }    
}

//sendMessages will take any array of strings and send it out to the specified socket
export let sendMessages = (socket : any, messages: any[]) => {
    let sendOut = new String("");
    for (let m in messages){
        sendOut += canonicalize(m) + '\n';
    }
    console.log("Sent out message:" + sendOut);
    socket.write(sendOut);
}

