const torrentProtocolFile = new File(["computernetwork"], "computernetwork");

// const magnetURI = "magnet:?xt=urn:btih:00000000000000000000000000000000000000";
// const magnetURI =
//   // TEST_MAGNET_URI;
//   "magnet:?xt=urn:btih:3731410718f7f86e8b1b5a4fb0ee1419faa11ccd&dn=computernetwork&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

(async () => {
  window.webtorrent = new WebTorrent();
  console.log("webtorrent", window.webtorrent, window.webtorrent.peerId);

  const p = new Promise((resolve, reject) => {
    try {
      window.webtorrent.seed(
        torrentProtocolFile,
        {
          announce: [
            "wss://envy.tailc3387.ts.net/bt",
            // "wss://tracker.webtorrent.io",
            "wss://tracker.fastcast.nz",
            "wss://tracker.btorrent.xyz",
            "wss://tracker.novage.com.ua",
            // "wss://peertube2.cpy.re/tracker/socket",
            "wss://tracker.openwebtorrent.com",
          ],
        },
        (_t) => {
          resolve(_t);
        },
      );
    } catch (e) {
      console.log("Error seeding", e);
      reject();
    }
  });

  const t = await p;

  const protocol = document.getElementById("protocol");
  const me = document.getElementById("me");
  const output = document.getElementById("output");
  setInterval(() => {
    protocol.innerText = t.magnetURI;
    me.innerText = window.webtorrent.peerId;
    output.innerText = JSON.stringify(Object.keys(t._peers));
  }, 1000);
})();
