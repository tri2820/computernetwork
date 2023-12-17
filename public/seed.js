const torrentProtocolFile = new File(
  ["computernetwork.io"],
  "computernetwork.io",
);

const TEST_MAGNET_URI = `magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fbig-buck-bunny.torrent`;
const magnetURI =
  // TEST_MAGNET_URI;
  "magnet:?xt=urn:btih:3731410718f7f86e8b1b5a4fb0ee1419faa11ccd&dn=computernetwork.io&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

(async () => {
  window.webtorrent = new WebTorrent();
  console.log("webtorrent", window.webtorrent, window.webtorrent.peerId);

  const p = new Promise((resolve, reject) => {
    try {
      window.webtorrent.seed(torrentProtocolFile, undefined, (_t) => {
        resolve(_t);
      });
    } catch (e) {
      console.log("Error seeding", e);
      reject();
    }
  });

  const t = await p;

  const output = document.getElementById("output");
  const me = document.getElementById("me");
  setInterval(() => {
    me.innerText = window.webtorrent.peerId;
    output.innerText = JSON.stringify(Object.keys(t._peers));
  }, 1000);
})();
