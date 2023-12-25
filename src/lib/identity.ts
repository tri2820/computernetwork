import { Message, Payload } from "~/app";

// @ts-ignore
import { KeyPair } from "libsodium-wrappers";
import { hashOf, ts_stamp_now, ts_unix_now, ts_verify } from "./utils";

export class Identity {
    keyPair: KeyPair;
    constructor() {
        this.keyPair = window.sodium.crypto_sign_keypair();
    }

    async sign(payload: Payload) {
        console.log('sign payload', payload);
        // Add nonce if ever use proof of work
        const hash = hashOf(payload);


        // const { data } = await ts_stamp_now(Buffer.from(hash));
        // if (!data) return;
        // const x = await ts_verify(data);


        const signature = window.sodium.crypto_sign_detached(hash, this.keyPair.privateKey)
        const message: Message = {
            payload,
            hash,
            public_key: this.keyPair.publicKey,
            signature,
            created_at: ts_unix_now()
        }

        return message
    }
}