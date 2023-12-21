import {
  component$,
  noSerialize,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Buffer } from "buffer/";
import _sodium from "libsodium-wrappers";
import t_computernetwork from "~/lib/t_computernetwork";
import { add, uint8ArrayToString } from "~/lib/utils";
import { GlobalContext } from "~/routes/layout";

// @ts-ignore

// @ts-ignore
import idbKVStore from "idb-kv-store";

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
    globalContext.publicKey_string = uint8ArrayToString(publicKey);

    const torrentsMetadata = new idbKVStore("torrentsMetadata");
    globalContext.torrentsMetadata = noSerialize(torrentsMetadata);

    torrentsMetadata.iterator((err: any, cursor: any) => {
      if (err) throw err;
      if (cursor) {
        const metadata = cursor.value;
        if (typeof metadata === "object" && metadata != null) {
          add(metadata, webtorrent);
        }
        cursor.continue();
      }
    });

    const webtorrent = new window.WebTorrent({
      // @ts-ignore
      nodeId: id,
      // @ts-ignore
      peerId: id,
    });
    console.log(webtorrent);
    globalContext.webtorrent = noSerialize(webtorrent);

    const { torrent } = add(magnetURI, webtorrent);

    if (!torrent) {
      console.log("Could not find protocol torrent");
      return;
    }

    torrent.on("wire", (wire) => {
      wire.use(t_computernetwork(globalContext));
    });

    setInterval(() => {
      globalContext.wires = noSerialize([...(torrent as any).wires]);
    }, 1000);

    globalContext.protocolTorrent = noSerialize(torrent);
  });

  return <></>;
});
