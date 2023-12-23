import { encode } from "cbor-x";
import { Instance, Torrent } from "webtorrent";
import { Payload, Message, Post, PostPayload } from "~/me";

// @ts-ignore
import idbChunkStore from "idb-chunk-store";
import ParseTorrent from "parse-torrent";

export const uint8ArrayToString = (arr: Uint8Array) => {
    return Buffer.from(arr).toString('base64')
}

const bindMetadataStore = (t: Torrent, TORRENTS_METADATA: any) => {
    t.on("metadata", async () => {
        const metadata = await ParseTorrent(t.torrentFile);
        TORRENTS_METADATA.add(metadata.infoHash, metadata);
        console.log(`Added`, t.infoHash);
    });
}

export const seed = (input: string | string[] | File | File[] | FileList | Buffer | Buffer[], webtorrent: Instance, TORRENTS_METADATA?: any) => {
    let torrent: Torrent | undefined;
    const torrentAwait = new Promise<Torrent | undefined>((resolve, reject) => {
        try {
            torrent = webtorrent.seed(input, {
                store: idbChunkStore
            }, (t) => {
                resolve(t)
            });
            if (TORRENTS_METADATA) {
                bindMetadataStore(torrent, TORRENTS_METADATA)
            }
        } catch {
            reject()
        }
    })


    return {
        torrentAwait,
        torrent
    }
}


export const add = (input: string | File | Buffer | ParseTorrent.Instance, webtorrent: Instance, 
    TORRENTS_METADATA?: any
    ) => {
    let torrent: Torrent | undefined;
    const torrentAwait = new Promise<Torrent | undefined>((resolve, reject) => {
        try {
            torrent = webtorrent.add(input, {
                store: idbChunkStore
            }, (t) => {
                resolve(t)
            });
            if (TORRENTS_METADATA) {
                bindMetadataStore(torrent, TORRENTS_METADATA)
            }
        } catch {
            reject()
        }
    })


    return {
        torrentAwait,
        torrent
    }
}


export const toPost = (message: Message, postpayload: PostPayload) => {
    const post: Post = {
        id: uint8ArrayToString(message.hash),
        created_at: postpayload.created_at,
        content: postpayload.content,
        public_key: uint8ArrayToString(message.public_key),
        file: postpayload.file
    }
    return post
}

export const INFO_HASH_REGEX = /urn:btih:([a-zA-Z0-9]{40})/;

export const prepareMessage = (payload: Payload, private_key: Uint8Array, public_key: Uint8Array) => {
    // Add nonce if ever use proof of work
    const serialized_payload = encode(payload);
    const hash = window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, serialized_payload);
    console.log('hash', hash);

    // Sign the message
    const signature = window.sodium.crypto_sign_detached(hash, private_key)
    console.log('sig', signature);

    const message: Message = {
        serialized_payload,
        hash,
        public_key,
        signature
    }
    const buffer = encode(message)
    return {
        message,
        buffer
    }
}

export const MEDIA_EXTENSIONS = {
    audio: [
        '.aac', '.aif', '.aiff', '.asf', '.dff', '.dsf', '.flac', '.m2a',
        '.m2a', '.m4a', '.mpc', '.m4b', '.mka', '.mp2', '.mp3', '.mpc', '.oga',
        '.ogg', '.opus', '.spx', '.wma', '.wav', '.wv', '.wvp'],
    video: [
        '.avi', '.mp4', '.m4v', '.webm', '.mov', '.mkv', '.mpg', '.mpeg',
        '.ogv', '.webm', '.wmv', '.m2ts'],
    image: ['.gif', '.jpg', '.jpeg', '.png']
}
