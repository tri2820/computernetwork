import { Wire } from 'bittorrent-protocol';
import { decode, encode } from 'cbor-x';
import { EventEmitter } from 'events';



const NAME = 't_computernetwork';
export default class t_computernetwork extends EventEmitter {
    static {
        this.prototype.name = NAME;
    }
    name: string;
    wire: Wire;


    constructor(wire: Wire) {
        super()
        this.name = NAME
        this.wire = wire
    }

    onHandshake(infoHash: string, peerId: string, extensions: { [name: string]: boolean; }) {
        console.log('onHandshake', infoHash, peerId, extensions)
    }

    onExtendedHandshake(handshake: { [key: string]: any; }) {
        console.log('onExtendedHandshake', handshake)

    }


    onMessage(buf: Buffer) {
        // Buffer looks like <length>:<sent_data> for some reason
        const colonPosition = buf.findIndex(x => x == 58);
        if (colonPosition == -1) return;
        let data = decode(buf.subarray(colonPosition + 1));
        console.log('onMessage', data);
    }

    // Custom methods
    send(obj: any) {
        let serializedAsBuffer = encode(obj);
        console.log('send', serializedAsBuffer)
        this.wire.extended(NAME, serializedAsBuffer);
    }
}
