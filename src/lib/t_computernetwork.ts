import { Wire } from 'bittorrent-protocol';
import { decode, encode } from 'cbor-x';
import { EventEmitter } from 'events';
import { Data, GlobalContextType, Message, Post } from '~/me';
import { hash, arr2text, concat } from "uint8-util";
import { toPost, uint8ArrayToString } from './utils';



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

        let message: Message;
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
        let data: Data;
        try {
            data = decode(message.payload);
        } catch (e) {
            console.warn('Error decode data', e);
            return;
        }

        // TODO: cache message

        if (data.post) {
            console.log(data);
            const newPost = toPost(message, data.post)
            this.globalContext.posts = [newPost, ...(this.globalContext.posts ?? [])]
        }

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
