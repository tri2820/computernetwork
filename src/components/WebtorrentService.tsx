import {
  component$,
  noSerialize,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import { GlobalContext } from "~/routes/layout";

const magnetURI =
  "magnet:?xt=urn:btih:3731410718f7f86e8b1b5a4fb0ee1419faa11ccd&dn=computernetwork.io&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

export default component$(() => {
  const globalContext = useContext(GlobalContext);

  useVisibleTask$(({ track }) => {
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
        // // @ts-ignore
        // console.log("peers", torrent._peers);
        // @ts-ignore
        globalContext.peers.value = noSerialize({ ...torrent._peers });
      }, 1000);
    });

    globalContext.protocolTorrent.value = noSerialize(t);
  });

  return <></>;
});
