import { encode } from "cbor-x";
import { Message, Payload } from "~/me";

// @ts-ignore
import { KeyPair } from "libsodium-wrappers";

export class Identity {
    keyPair: KeyPair;
    constructor() {
        this.keyPair = window.sodium.crypto_sign_keypair();
    }

    sign(payload: Payload) {
        // Add nonce if ever use proof of work
        const serialized_payload = encode(payload);
        const hash = window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, serialized_payload);
        console.log('hash', hash);

        // Sign the message
        const signature = window.sodium.crypto_sign_detached(hash, this.keyPair.privateKey)
        console.log('sig', signature);

        const message: Message = {
            serialized_payload,
            hash,
            public_key: this.keyPair.publicKey,
            signature
        }

        return message
    }
}