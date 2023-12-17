import type { NoSerialize, Signal } from '@builder.io/qwik';
import type { Instance, Torrent, WebTorrent } from '@types/webtorrent'
import type { Buffer } from 'buffer/';


declare global {
    interface Window {
        bodymovin: any;
        WebTorrent: WebTorrent;
        Buffer: any
    }
}


export type GlobalContextType = {
    protocolTorrent: Signal<NoSerialize<Torrent> | null>,
    peers: Signal<NoSerialize<{ [id: string]: any }>>,
    webtorrent: Signal<NoSerialize<Instance> | null>
}

export { }