import { Instance, Torrent } from "webtorrent";
import { Message, Post, PostPayload } from "~/me";

// @ts-ignore
import idbChunkStore from "idb-chunk-store";
import type { Instance as ParseTorrentInstance } from "parse-torrent";
import { encode } from "cbor-x";

export const uint8ArrayToString = (arr: Uint8Array) => {
    return Buffer.from(arr).toString('base64')
}

const bindMetadataStore = (t: Torrent, table_torrent_metadata: any) => {
    t.on("metadata", async () => {
        table_torrent_metadata.add(t.infoHash, t.torrentFile);
        console.log(`Added`, t.infoHash);
    });
}

export const seed = (input: string | string[] | File | File[] | FileList | Buffer | Buffer[], webtorrent: Instance, table_torrent_metadata?: any) => {
    let torrent: Torrent | undefined;
    const torrentAwait = new Promise<Torrent | undefined>((resolve, reject) => {
        try {
            torrent = webtorrent.seed(input, {
                store: idbChunkStore
            }, (t) => {
                resolve(t)
            });
            if (table_torrent_metadata) {
                bindMetadataStore(torrent, table_torrent_metadata)
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


export const add = (input: string | File | Buffer | ParseTorrentInstance, webtorrent: Instance,
    table_torrent_metadata?: any
) => {
    let torrent: Torrent | undefined;
    const torrentAwait = new Promise<Torrent | undefined>((resolve, reject) => {
        try {
            torrent = webtorrent.add(input, {
                store: idbChunkStore
            }, (t) => {
                resolve(t)
            });
            if (table_torrent_metadata) {
                bindMetadataStore(torrent, table_torrent_metadata)
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

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function hashOf(x : any){
    const serialized = encode(x);
    const hash = window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, serialized);
    return hash
}

export const equal = (first: Uint8Array, second: Uint8Array) =>
    first.length === second.length && first.every((value, index) => value === second[index]);
