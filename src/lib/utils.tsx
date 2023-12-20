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