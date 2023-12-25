import { Data, Message, Payload } from "~/app";

// @ts-ignore
import { KeyPair } from "libsodium-wrappers";
import { hashOf, ts_stamp_now, ts_unix_now, ts_verify } from "./utils";

export class Identity {
    keyPair: KeyPair;
    constructor(keyPair?: KeyPair) {
        this.keyPair = keyPair ?? window.sodium.crypto_sign_keypair();
    }

    async sign(data: Data) {
        const payload: Payload = {
            public_key: this.keyPair.publicKey,
            created_at: ts_unix_now(),
            data
        }
        // Add nonce if ever use proof of work
        const hash = hashOf(payload);


        // const { data } = await ts_stamp_now(Buffer.from(hash));
        // if (!data) return;
        // const x = await ts_verify(data);


        const signature = window.sodium.crypto_sign_detached(hash, this.keyPair.privateKey)
        const message: Message = {
            payload,
            hash,
            signature,
        }

        return message
    }
}