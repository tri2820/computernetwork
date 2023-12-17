import {
  component$,
  noSerialize,
  useContext,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { Wire } from "bittorrent-protocol";
import Protocol from "bittorrent-protocol";
import { Buffer } from "buffer/";
import t_computernetwork from "~/lib/t_computernetwork";
import { GlobalContext } from "~/routes/layout";
import _sodium from "libsodium-wrappers";
import { hash, arr2text, concat } from "uint8-util";

const magnetURI =
  "magnet:?xt=urn:btih:3731410718f7f86e8b1b5a4fb0ee1419faa11ccd&dn=computernetwork.io&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

export default component$(() => {
  const globalContext = useContext(GlobalContext);

  useVisibleTask$(async ({ track }) => {
    window.Buffer = Buffer;

    await _sodium.ready;
    window.sodium = _sodium;

    const keyPair = window.sodium.crypto_sign_keypair();
    globalContext.privateKey = noSerialize(keyPair.privateKey);
    const publicKey = keyPair.publicKey;
    const id = new Buffer(publicKey).subarray(0, 20);
    globalContext.publicKey = noSerialize(publicKey);

    const webtorrent = new window.WebTorrent({
      // @ts-ignore
      nodeId: id,
      // @ts-ignore
      peerId: id,
    });
    console.log(webtorrent);
    globalContext.webtorrent = noSerialize(webtorrent);

    const t = webtorrent.add(magnetURI, undefined, (torrent) => {
      console.log("Client is downloading:", torrent.infoHash, torrent);
      for (const file of torrent.files) {
        console.log(file.name);
      }
    });

    setInterval(() => {
      globalContext.wires = noSerialize([...(t as any).wires]);
    }, 1000);

    t.on("wire", (wire) => {
      wire.use(t_computernetwork);
    });

    globalContext.protocolTorrent = noSerialize(t);
  });

  return <></>;
});
