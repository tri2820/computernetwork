import type { NoSerialize } from "@builder.io/qwik";
import {
  component$,
  noSerialize,
  useContext,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { Wire } from "bittorrent-protocol";
import Protocol from "bittorrent-protocol";
import { Buffer } from "buffer/";
import t_computernetwork from "~/lib/t_computernetwork";
import { GlobalContext } from "~/routes/layout";

const magnetURI =
  "magnet:?xt=urn:btih:3731410718f7f86e8b1b5a4fb0ee1419faa11ccd&dn=computernetwork.io&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

// const extendProtocol = (infoHash: string, myId: string) => (w: Wire) => {
//   console.log("extend this", w);

// Sending an extended message
// w.use(t_computernetwork);
// w.handshake(infoHash, myId);
// w.on("handshake", () => {
//   console.log("handshake again");
// });
// w.extended("t_computernetwork", Buffer.from("Hello, peer!"));

// w.pipe(w);
// w.use(t_computernetwork);

// w.extendedHandshake.t_computernetwork_metadata = {
//   version: 3,
// };

// w.handshake(t.infoHash, w.peerId);

// w.once("extended", () => {
//   const x = Math.random();
//   const b = new Buffer(`${x}`);
//   console.log("send", w.peerId, b);
//   w.extended("t_computernetwork", b);
// });
// };

export default component$(() => {
  const globalContext = useContext(GlobalContext);
  const wires = useSignal<NoSerialize<Wire[]>>(noSerialize([]));

  useVisibleTask$(({ track }) => {
    track(() => wires.value);
    console.log("wires changed", wires.value);
  });

  useVisibleTask$(({ track }) => {
    window.Buffer = Buffer;

    const webtorrent = new window.WebTorrent();
    console.log(webtorrent);
    globalContext.webtorrent.value = noSerialize(webtorrent);

    console.log("add");
    const t = webtorrent.add(magnetURI, undefined, (torrent) => {
      console.log("Client is downloading:", torrent.infoHash, torrent);
      for (const file of torrent.files) {
        console.log(file.name);
      }

      setInterval(() => {
        // @ts-ignore
        globalContext.peers.value = noSerialize({ ...torrent._peers });

        const newWires: Wire[] = wires.value
          ? // @ts-ignore
            t.wires.filter(
              (w: Wire) => !wires.value!.some((x) => x.peerId == w.peerId),
            )
          : // @ts-ignore
            t.wires;

        newWires.forEach((w) => {
          const support = w.peerExtendedHandshake?.m?.t_computernetwork;
          // console.log("support", support, w.peerId);
          if (!support) return;
          w.t_computernetwork.send();
        });

        if (newWires.length === 0) return;
        wires.value = noSerialize([...(wires.value ?? []), ...newWires]);
      }, 1000);
    });

    t.on("wire", (wire) => {
      // console.log("wire >", wire.peer);
      wire.use(t_computernetwork);
      // wire.on("extended", (ext, buf) => {
      //   console.log("extended", ext, buf);
      //   // if (ext === 'my_extension') {
      //   //     // Handle the custom extended message
      //   // }
      // });
    });

    globalContext.protocolTorrent.value = noSerialize(t);

    return;

    const wire = new Protocol(); // outgoing
    wire.use(t_computernetwork);
    wire.pipe(wire);
    wire.extendedHandshake.version = 3;

    wire.handshake(
      "3031323334353637383930313233343536373839",
      "3132333435363738393031323334353637383930",
    );

    wire.once("extended", () => {
      console.log("extended");
      wire.extended("t_computernetwork", Buffer.from("hello world!"));
      console.log("wire done extended");
    });
  });

  return <></>;
});
