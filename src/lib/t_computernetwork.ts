import { Wire } from 'bittorrent-protocol';
import { EventEmitter } from 'events';
import { QRL } from '@builder.io/qwik';

const NAME = 't_computernetwork';
export type OnMessageType = QRL<(buf: Buffer) => void>;
export default (publicKey: Uint8Array, _onMessage: OnMessageType) => class t_computernetwork extends EventEmitter {
    static {
        this.prototype.name = NAME;
    }
    name: string;
    wire: Wire;
    _onMessage: OnMessageType;

    constructor(wire: Wire) {
        super()
        this.name = NAME
        this.wire = wire
        this.wire.extendedHandshake = {
            ...this.wire.extendedHandshake,
            publicKey
        }
        this._onMessage = _onMessage;
    }

    onHandshake(infoHash: string, peerId: string, extensions: { [name: string]: boolean; }) {
        console.log('onHandshake', infoHash, peerId, extensions)
    }

    onExtendedHandshake(handshake: { [key: string]: any; }) {
        console.log('onExtendedHandshake', handshake)
    }


    onMessage(buf: Buffer) {
        this._onMessage(buf);
    }

    // Custom methods
    send(buffer: Buffer) {
        const peerSupportThisProtocol = this.wire.peerExtendedHandshake?.m?.t_computernetwork;
        if (!peerSupportThisProtocol) {
            console.log('skip sending to', this.wire.peerId);
            return
        }
        console.log('send', buffer);
        this.wire.extended(NAME, buffer);
    }

}
