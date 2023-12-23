import {
  $,
  component$,
  noSerialize,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Buffer } from "buffer";
import { decode } from "cbor-x";
import _sodium from "libsodium-wrappers";
import t_computernetwork from "~/lib/t_computernetwork";
import { add, toPost, uint8ArrayToString } from "~/lib/utils";
import { GlobalContext } from "~/routes/layout";
// @ts-ignore
import idbKVStore from "idb-kv-store";
import type { Payload, Message } from "~/me";
import ParseTorrent from "parse-torrent";

const magnetURI =
  "magnet:?xt=urn:btih:3731410718f7f86e8b1b5a4fb0ee1419faa11ccd&dn=computernetwork.io&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

export default component$(() => {
  const globalContext = useContext(GlobalContext);

  const onMessage = $((buf: Buffer) => {
    // Buffer looks like <length>:<sent_data> for some reason
    const colonPosition = buf.findIndex((x) => x == 58);
    if (colonPosition == -1) return;

    let message: Message;
    try {
      message = decode(buf.subarray(colonPosition + 1));
    } catch (e) {
      console.warn("Error decode message", e);
      return;
    }

    const isValid =
      window.sodium.crypto_sign_verify_detached(
        message.signature,
        message.hash,
        message.public_key,
      ) &&
      window.sodium.crypto_generichash(
        window.sodium.crypto_generichash_BYTES,
        message.serialized_payload,
      );

    if (!isValid) {
      console.warn("Cannot verify message");
      return;
    }

    console.log("Message", message);
    let payload: Payload;
    try {
      payload = decode(message.serialized_payload);
    } catch (e) {
      console.warn("Error decode", e);
      return;
    }

    if (payload.post) {
      console.log(payload);
      const newPost = toPost(message, payload.post);
      globalContext.posts = [newPost, ...(globalContext.posts ?? [])];
    }
  });

  useVisibleTask$(async ({ track }) => {
    window.Buffer = Buffer;

    await _sodium.ready;
    window.sodium = _sodium;

    const keyPair = window.sodium.crypto_sign_keypair();
    globalContext.private_key = noSerialize(keyPair.privateKey);
    const public_key = keyPair.publicKey;
    const id = Buffer.from(public_key).subarray(0, 20);
    globalContext.public_key = noSerialize(public_key);
    globalContext.public_key_string = uint8ArrayToString(public_key);

    const TORRENTS_METADATA = new idbKVStore("TORRENTS_METADATA");
    globalContext.TORRENTS_METADATA = noSerialize(TORRENTS_METADATA);
    TORRENTS_METADATA.iterator((err: any, cursor: any) => {
      if (err) throw err;
      if (cursor) {
        const torrentFile = cursor.value;
        (async () => {
          // @ts-ignore
          const parsed: ParseTorrent.Instance = await ParseTorrent(torrentFile);
          add(parsed, webtorrent);
        })();
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
      wire.use(t_computernetwork(public_key, onMessage));
    });

    setInterval(() => {
      globalContext.wires = noSerialize([...(torrent as any).wires]);
    }, 1000);

    globalContext.main_torrent = noSerialize(torrent);
  });

  return <></>;
});
