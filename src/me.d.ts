import type { NoSerialize, Signal } from '@builder.io/qwik';
import type { Instance, Torrent, WebTorrent } from '@types/webtorrent'
import type { Wire } from 'bittorrent-protocol';
import type { Buffer } from 'buffer/';
import type _sodium from "libsodium-wrappers";


declare global {
    interface Window {
        bodymovin: any;
        WebTorrent: WebTorrent;
        Buffer: any
        sodium: typeof _sodium;
    }

}

export type OneOf<T> = {
    [K in keyof T]: { [_ in K]: T[K] } & { [_ in keyof Omit<T, K>]?: undefined };
}[keyof T];

export type Result<T> = OneOf<{
    error: {
        message: string;
    };
    data: T;
}>;

export type FileInfo = {
    name: string,
    type: string,
    size: number
}

export type FileThroughTorrent = FileInfo & {
    magnetURI: string,
}

export type DataPost = {
    file?: FileThroughTorrent,
    content: string,
    created_at: number,
}
export type Data = OneOf<{
    post: DataPost
}
>

export type Message = {
    payload: window.Buffer,
    hash: Uint8Array,
    publicKey: Uint8Array,
    signature: Uint8Array
}

export type Post = {
    id: string,
    publicKey: string,
    content: string,
    created_at: number,
    file?: FileThroughTorrent
}

export type GlobalContextType = {
    protocolTorrent?: NoSerialize<Torrent>,
    wires?: NoSerialize<Wire[]>,
    webtorrent?: NoSerialize<Instance>,
    privateKey?: NoSerialize<Uint8Array>,
    publicKey?: NoSerialize<Uint8Array>,
    publicKey_string?: string,
    posts?: Post[]
}

export { }