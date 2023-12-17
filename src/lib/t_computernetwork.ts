import { Wire } from 'bittorrent-protocol';
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
        // this._send({ msg_type: 0, piece })
        console.log('onHandshake', infoHash, peerId, extensions)
    }

    onExtendedHandshake(handshake: { [key: string]: any; }) {
        console.log('onExtendedHandshake', handshake)

    }

    onMessage(buf: Buffer) {
        console.log('onMessage', buf)
    }

    // Custom methods
    send() {
        console.log('send', this.wire.peerIdBuffer)
        this.wire.extended(NAME,
            this.wire.peerIdBuffer
            // Buffer.from([22, 2, 0, 3])
        );
    }
}
