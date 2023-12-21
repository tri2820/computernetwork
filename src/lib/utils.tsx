import { encode } from "cbor-x";
import { Instance, Torrent } from "webtorrent";
import { Data, DataPost, Message, Post } from "~/me";

// @ts-ignore
import idbChunkStore from "idb-chunk-store";
import ParseTorrent from "parse-torrent";

export const uint8ArrayToString = (arr: Uint8Array) => {
    return Buffer.from(arr).toString('base64')
}

const bindMetadataStore = (t: Torrent, torrentsMetadata: any) => {
    t.on("metadata", async () => {
        const metadata = await ParseTorrent(t.torrentFile);
        torrentsMetadata.add(metadata.infoHash, metadata);
        console.log(`Added`, t.infoHash);
    });
}

export const seed = (input: string | string[] | File | File[] | FileList | Buffer | Buffer[], webtorrent: Instance, torrentsMetadata: any) => {
    let torrent: Torrent | undefined;
    const torrentAwait = new Promise<Torrent>((resolve, reject) => {
        try {
            torrent = webtorrent.seed(input, {
                store: idbChunkStore
            }, (t) => {
                resolve(t)
            });
            bindMetadataStore(torrent, torrentsMetadata)
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
    torrentsMetadata?: any
    ) => {
    let torrent: Torrent | undefined;
    const torrentAwait = new Promise<Torrent>((resolve, reject) => {
        try {
            torrent = webtorrent.add(input, {
                store: idbChunkStore
            }, (t) => {
                resolve(t)
            });
            if (torrentsMetadata) {
                bindMetadataStore(torrent, torrentsMetadata)
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


export const toPost = (message: Message, datapost: DataPost) => {
    const post: Post = {
        id: uint8ArrayToString(message.hash),
        created_at: datapost.created_at,
        content: datapost.content,
        publicKey: uint8ArrayToString(message.publicKey),
        file: datapost.file
    }
    return post
}

export const INFO_HASH_REGEX = /urn:btih:([a-zA-Z0-9]{40})/;

export const prepareMessage = (data: Data, privateKey: Uint8Array, publicKey: Uint8Array) => {
    // Add nonce if ever use proof of work
    const payload = encode(data);
    const hash = window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, payload);
    console.log('hash', hash);

    // Sign the message
    const signature = window.sodium.crypto_sign_detached(hash, privateKey)
    console.log('sig', signature);

    const message: Message = {
        payload,
        hash,
        publicKey,
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
