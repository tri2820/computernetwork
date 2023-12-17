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

export type User = {
    avatarImageUrl: string,
    name: string,
    publicKey: string
}

export type Post = {
    id: string,
    publicKey: string,
    content: string,
    created_at: number
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