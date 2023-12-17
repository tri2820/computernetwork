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
        let message = decode(buf.subarray(colonPosition + 1));
        console.log('onMessage', message, decode(message.payload));
    }

    // Custom methods
    send({
        data,
        publicKey,
        privateKey
    }: {
        data: any,
        publicKey: Uint8Array,
        privateKey: Uint8Array
    }) {
        const peerSupportThisProtocol = this.wire.peerExtendedHandshake?.m?.t_computernetwork;
        if (!peerSupportThisProtocol) {
            console.log('skip sending to', this.wire.peerId);
            return
        }

        const payload = encode(data);
        const hash = window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, payload);
        console.log('hash', hash);

        // Sign the message
        const signature = window.sodium.crypto_sign_detached(hash, privateKey)
        console.log('sig', signature);
        // // To verify the signature, use the public key
        // const isValid = 
        //     window.sodium.crypto_sign_verify_detached(signature, hash, publicKey)
        //     && window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, payload);


        // return;
        const message = encode({
            payload,
            hash,
            publicKey,
            signature
        })
        console.log('send', message);

        this.wire.extended(NAME, message);
    }
}
