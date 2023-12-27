import {
  $,
  component$,
  noSerialize,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Buffer } from "buffer";
import { decode, encode } from "cbor-x";
import _sodium from "libsodium-wrappers";
import type {
  OnExtendedHandshakeType,
  OnMessageType,
} from "~/lib/t_computernetwork";
import t_computernetwork from "~/lib/t_computernetwork";
import {
  add,
  addMessagesToStorage,
  hashOf,
  uint8ArrayToString,
  uint8equal,
} from "~/lib/utils";
import { GlobalContext } from "~/routes/layout";
// @ts-ignore
import idbKVStore from "idb-kv-store";
import ParseTorrent from "parse-torrent";
import type { Data, Message, Payload, Storage } from "~/app";
import { Identity } from "~/lib/identity";

const magnetURI =
  "magnet:?xt=urn:btih:3731410718f7f86e8b1b5a4fb0ee1419faa11ccd&dn=computernetwork&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";
const STORAGE_KEY = "STORAGE";

export default component$(() => {
  const globalContext = useContext(GlobalContext);

  const onExtendedHandshake: OnExtendedHandshakeType = $(
    async (_this, handshake) => {
      const data: Data = {
        query_post: {},
      };
      const message = await globalContext.storage!.identity!.sign(data);
      _this.send(message);
    },
  );

  const onMessage: OnMessageType = $(async (_this, buf) => {
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

    if (message.payload.data.post || message.payload.data.react) {
      if (
        !window.sodium.crypto_sign_verify_detached(
          message.signature,
          message.hash,
          message.payload.public_key,
        )
      ) {
        console.log("Not valid signature on hash");
        return;
      }
    }

    const hash = hashOf(message.payload);
    if (!uint8equal(hash, message.hash)) {
      console.warn("Incorrect hash", hash, message.hash);
      return;
    }

    // Store messages of important types
    if (message.payload.data.post || message.payload.data.react) {
      addMessagesToStorage(globalContext, [message]);
    }

    if (message.payload.data.query_post) {
      console.log("Peer asked for posts in my DB");
      if (!globalContext.storage) return;
      const postMessages = globalContext.storage.messages.filter(
        (m) => m.payload.data.post,
      );
      if (postMessages.length == 0) return;

      const query_post_result_data: Data = {
        query_post_result: {
          data: postMessages.slice(0, 100),
        },
      };
      const query_post_result_message =
        await globalContext.storage!.identity!.sign(query_post_result_data);
      _this.send(query_post_result_message);
    }

    if (message.payload.data.query_post_result) {
      if (message.payload.data.query_post_result.data) {
        addMessagesToStorage(
          globalContext,
          message.payload.data.query_post_result.data,
        );
      }
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => globalContext.storage);
    const values = encode(globalContext.storage);
    globalContext.table_local_state?.set(STORAGE_KEY, values);
  });

  useVisibleTask$(async ({ track }) => {
    window.Buffer = Buffer;

    // For inspection
    window.globalContext = globalContext;

    await _sodium.ready;
    window.sodium = _sodium;

    const store = new idbKVStore("table_local_state");
    globalContext.table_local_state = noSerialize(store);
    const values = await store.get(STORAGE_KEY);
    if (values) {
      const storage: Storage = decode(values);
      console.log(
        "load storage",
        uint8ArrayToString(storage!.identity.keyPair.publicKey),
      );
      globalContext.storage = noSerialize({
        ...storage,
        // Turn back into class
        identity: new Identity(storage.identity.keyPair),
      });
    } else {
      globalContext.storage = noSerialize({
        messages: [],
        identity: new Identity(),
      });
    }

    const id = Buffer.from(
      globalContext.storage!.identity.keyPair.publicKey,
    ).subarray(0, 20);
    globalContext.public_key_string = uint8ArrayToString(
      globalContext.storage!.identity.keyPair.publicKey,
    );

    const table_torrent_metadata = new idbKVStore("table_torrent_metadata");
    globalContext.table_torrent_metadata = noSerialize(table_torrent_metadata);
    table_torrent_metadata.iterator((err: any, cursor: any) => {
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
      wire.use(
        t_computernetwork({
          public_key: globalContext.storage!.identity.keyPair.publicKey,
          onMessage,
          onExtendedHandshake,
        }),
      );
    });

    setInterval(() => {
      globalContext.wires = noSerialize([...(torrent as any).wires]);
    }, 1000);

    globalContext.main_torrent = noSerialize(torrent);
  });

  return <></>;
});
