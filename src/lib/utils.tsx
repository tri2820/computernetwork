import { encode } from "cbor-x";
import { Instance, Torrent } from "webtorrent";
import { Data, DataPost, Message, Post } from "~/me";

export const uint8ArrayToString = (arr: Uint8Array) => {
    return Buffer.from(arr).toString('base64')
}

export const seed = (file: File, webtorrent: Instance) => {
    const p = new Promise<Torrent>((resolve, reject) => {
        try {
            webtorrent.seed(file, undefined, (t) => {
                resolve(t)
            });
        } catch {
            reject()
        }
    })
    return p;
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
