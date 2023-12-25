import { Wire } from 'bittorrent-protocol';
import { EventEmitter } from 'events';
import { QRL } from '@builder.io/qwik';
import { Message } from '~/app';
import { encode } from 'cbor-x';

const NAME = 't_computernetwork';
class t_computernetwork extends EventEmitter {
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

    // TODO: Also possibly Payload for non-signed stuffs
    send(input: Message) {
        const buffer = encode(input)
        const peerSupportThisProtocol = this.wire.peerExtendedHandshake?.m?.t_computernetwork;
        if (!peerSupportThisProtocol) {
            console.log('skip sending to', this.wire.peerId);
            return
        }
        console.log('send', buffer);
        this.wire.extended(NAME, buffer);
    }

}

export type OnMessageType = QRL<(_this: t_computernetwork, buf: Buffer) => void>;
export type OnHandshakeType = QRL<(_this: t_computernetwork, infoHash: string, peerId: string, extensions: { [name: string]: boolean; }) => void>;
export type OnExtendedHandshakeType = QRL<(_this: t_computernetwork, handshake: { [key: string]: any; }) => void>

type t_computernetworkProps = {
    public_key: Uint8Array,
    onHandshake?: OnHandshakeType,
    onExtendedHandshake?: OnExtendedHandshakeType,
    onMessage?: OnMessageType,
}

export default ({
    public_key,
    onHandshake,
    onExtendedHandshake,
    onMessage
}: t_computernetworkProps) => class _ extends t_computernetwork {
        constructor(wire: Wire) {
            super(wire)
            this.name = NAME
            this.wire = wire
            this.wire.extendedHandshake = {
                ...this.wire.extendedHandshake,
                public_key
            }
        }

        // Note: first this bind is useless
        onHandshake = onHandshake?.bind(this, this)
        onExtendedHandshake = onExtendedHandshake?.bind(this, this)
        onMessage = onMessage?.bind(this, this)
    }
