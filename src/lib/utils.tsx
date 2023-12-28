import { Instance, Torrent } from "webtorrent";
import { GlobalContextType, Message, Post, PostData, Result } from "~/app";


import { noSerialize } from "@builder.io/qwik";
import { Buffer } from "buffer";
import { encode } from "cbor-x";
// @ts-ignore
import idbChunkStore from "idb-chunk-store";
import type { Instance as ParseTorrentInstance } from "parse-torrent";
// const OpenTimestamps = require('opentimestamps');

export const uint8ArrayToString = (arr: Uint8Array) => {
    return Buffer.from(arr).toString('base64')
}

export const stringToUInt8Array = (str: string): Uint8Array => {
    return Buffer.from(str, 'base64')
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
                store: idbChunkStore,
                announce: [
                    "wss://100.70.227.1:5555",
                    // "wss://tracker.webtorrent.io",
                    "wss://tracker.fastcast.nz",
                    "wss://tracker.btorrent.xyz",
                    "wss://tracker.novage.com.ua",
                    // "wss://peertube2.cpy.re/tracker/socket",
                    "wss://tracker.openwebtorrent.com"
                ]
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


export const toPost = (message: Message, postdata: PostData) => {
    const post: Post = {
        id: uint8ArrayToString(message.hash),
        created_at: message.payload.created_at,
        content: postdata.content,
        public_key: uint8ArrayToString(message.payload.public_key),
        file: postdata.file,
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

export function hashOf(x: any) {
    const serialized = encode(x);
    const hash = window.sodium.crypto_generichash(window.sodium.crypto_generichash_BYTES, serialized);
    return hash
}

export const uint8equal = (first: Uint8Array, second: Uint8Array) =>
    first.length === second.length && first.every((value, index) => value === second[index]);

export const ts_stamp_now = async (hash: Buffer): Promise<Result<{
    detached: any,
    fileOts: any,
    detachedOts: any
}>> => {
    const detached = window.OpenTimestamps.DetachedTimestampFile.fromHash(new window.OpenTimestamps.Ops.OpSHA256(), hash);
    try {
        await window.OpenTimestamps.stamp(detached);
        const fileOts: Uint8Array = detached.serializeToBytes();
        const detachedOts = window.OpenTimestamps.DetachedTimestampFile.deserialize(fileOts);
        return {
            data: {
                detached,
                fileOts,
                detachedOts
            }
        }
    } catch (err) {
        return {
            error: {
                message: 'Cannot stamp'
            }
        }
    }
}

// Note: Instantly verifying after stamping could return {} (pending)
export const ts_verify = async ({
    detached,
    detachedOts
}: {
    detached: any,
    detachedOts: any
}): Promise<Result<{
    verifyResult: any
}>> => {
    let options: any = {};
    options.ignoreBitcoinNode = true;
    options.timeout = 5000;

    // console.log('debug ts_verify', detachedOts, detached, options);

    try {
        const verifyResult = await window.OpenTimestamps.verify(detachedOts, detached, options)
        return {
            data: {
                verifyResult
            }
        }
    } catch (e) {
        console.log('e', e);
        return {
            error: {
                message: 'Cannot verify timestamp'
            }
        }
    }

}

export const ts_unix_now = () => Math.floor(new Date().getTime() / 1000)
export const ts_unix2js = (unixts: number) => unixts * 1000
export const tif = (cond: boolean, classNamesTrue: string, classNamesFalse = "") => {
    return cond ? ` ${classNamesTrue} ` : ` ${classNamesFalse} `;
};


export const addMessagesToStorage = (globalContext: GlobalContextType, new_messages: Message[]) => {
    if (!globalContext.storage) return;

    const uniqueHashes: any = {}
    const uniqueReacts: any = {}
    let messages = [...(globalContext.storage?.messages ?? []), ...new_messages]
        .sort((a, b) => b.payload.created_at - a.payload.created_at)
        .map(m => {
            const id = uint8ArrayToString(m.hash);
            if (uniqueHashes[id]) return;
            uniqueHashes[id] = true;
            return m;
        })
        .filter(notEmpty)
        .map(m => {
            if (!m.payload.data.react) return m;
            // Only store one react message per user
            const id = `${uint8ArrayToString(m.payload.public_key)}-${uint8ArrayToString(m.payload.data.react.for_message_hash)}`;
            if (uniqueReacts[id]) {
                return;
            }
            uniqueReacts[id] = true;
            return m;
        })
        .filter(notEmpty)
        .map(m => {
            if (!m.payload.data.react) return m;
            if (m.payload.data.react.state == 'neutral') return;
            return m;
        })
        .filter(notEmpty);

    globalContext.storage = noSerialize({
        ...globalContext.storage,
        messages,
    });
}

export function humanFileSize(size: number) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    // @ts-ignore
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}