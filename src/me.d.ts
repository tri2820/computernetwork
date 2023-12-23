import type { NoSerialize, Signal } from '@builder.io/qwik';
import type { Instance, Torrent, WebTorrent } from '@types/webtorrent'
import type { Wire } from 'bittorrent-protocol';
import type _sodium from "libsodium-wrappers";
import type { Identity } from './lib/identity';

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

export type PostPayload = {
    file?: FileThroughTorrent,
    content: string,
    created_at: number,
}

export type QueryPostPayload = {
    // bloom filters of my posts
}

export type QueryPostResultPayload = Result<Message[]>

export type Payload = OneOf<{
    post: PostPayload,
    query_post: QueryPostPayload,
    query_post_result: QueryPostResultPayload,
}>

export type Message = {
    payload: Payload,
    hash: Uint8Array,
    public_key: Uint8Array,
    signature: Uint8Array
}

export type Post = {
    id: string,
    public_key: string,
    content: string,
    created_at: number,
    file?: FileThroughTorrent
}


export type GlobalContextType = {
    main_torrent?: NoSerialize<Torrent>,
    wires?: NoSerialize<Wire[]>,
    webtorrent?: NoSerialize<Instance>,
    identity?: NoSerialize<Identity>,
    public_key_string?: string,
    storage?: NoSerialize<{
        // Avoid __no_serialize__ tag
        messages: {
            [id: string]: Message
        }
    }>,
    // Indexed DB tables
    table_torrent_metadata?: NoSerialize<any>,
    table_local_state?: NoSerialize<any>
}

export { }