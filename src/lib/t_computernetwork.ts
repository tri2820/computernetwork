import { Wire } from 'bittorrent-protocol';
import { decode, encode } from 'cbor-x';
import { EventEmitter } from 'events';
import { GlobalContextType, Post } from '~/me';
import { hash, arr2text, concat } from "uint8-util";
import { uint8ArrayToString } from './utils';



const NAME = 't_computernetwork';
export default (globalContext: GlobalContextType) => class t_computernetwork extends EventEmitter {
    static {
        this.prototype.name = NAME;
    }
    name: string;
    wire: Wire;
    globalContext: GlobalContextType;


    constructor(wire: Wire) {
        super()
        this.name = NAME
        this.wire = wire
        this.globalContext = globalContext
        this.wire.extendedHandshake = {
            ...this.wire.extendedHandshake,
            publicKey: this.globalContext.publicKey
        }
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

        let message;
        try {
            message = decode(buf.subarray(colonPosition + 1));
        } catch (e) {
            console.warn('Error decode message', e);
            return;
        }

        if (!message.signature || !message.hash || !message.publicKey || !message.payload) {
            console.warn('Receive invalid message, missing field(s)');
            return;
        }

        const isValid =
            window.sodium.crypto_sign_verify_detached(message.signature, message.hash, message.publicKey)
            && window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, message.payload);

        if (!isValid) {
            console.warn('Cannot verify message');
            return;
        }

        console.log('Message', message);
        let data;
        try {
            data = decode(message.payload);
        } catch (e) {
            console.warn('Error decode data', e);
            return;
        }

        // TODO: cache message

        if (data.post) {
            const newPost: Post = {
                id: uint8ArrayToString(message.hash),
                created_at: data.post.created_at,
                content: data.post.content,
                publicKey: uint8ArrayToString(message.publicKey)
            }
            this.globalContext.posts = [...(this.globalContext.posts ?? []), newPost]
        }

    }

    // Custom methods
    send(data: any) {
        const peerSupportThisProtocol = this.wire.peerExtendedHandshake?.m?.t_computernetwork;
        if (!peerSupportThisProtocol) {
            console.log('skip sending to', this.wire.peerId);
            return
        }

        const payload = encode(data);
        const hash = window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, payload);
        console.log('hash', hash);

        // Sign the message
        const signature = window.sodium.crypto_sign_detached(hash, this.globalContext.privateKey!)
        console.log('sig', signature);

        const message = encode({
            payload,
            hash,
            publicKey: this.globalContext.publicKey!,
            signature
        })
        console.log('send', message);

        this.wire.extended(NAME, message);
    }
}
