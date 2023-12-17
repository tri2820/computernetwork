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


export type GlobalContextType = {
    protocolTorrent: Signal<NoSerialize<Torrent> | null>,
    wires: Signal<NoSerialize<Wire[]>>,
    webtorrent: Signal<NoSerialize<Instance> | null>,
    privateKey: Signal<NoSerialize<Uint8Array> | null>,
    publicKey: Signal<NoSerialize<Uint8Array> | null>,
}

export { }