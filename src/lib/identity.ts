import { encode } from "cbor-x";
import { Message, Payload } from "~/me";

// @ts-ignore
import { KeyPair } from "libsodium-wrappers";
import { hashOf } from "./utils";

export class Identity {
    keyPair: KeyPair;
    constructor() {
        this.keyPair = window.sodium.crypto_sign_keypair();
    }

    sign(payload: Payload) {
        console.log('sign payload', payload);
        // Add nonce if ever use proof of work
        const hash = hashOf(payload);
        const signature = window.sodium.crypto_sign_detached(hash, this.keyPair.privateKey)
        const message: Message = {
            payload,
            hash,
            public_key: this.keyPair.publicKey,
            signature
        }

        return message
    }
}