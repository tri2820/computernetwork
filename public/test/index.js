const torrentProtocolFile = new File(["computernetwork"], "computernetwork");

const TEST_MAGNET_URI = `magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fbig-buck-bunny.torrent`;
const magnetURI =
  // TEST_MAGNET_URI;
  "magnet:?xt=urn:btih:3731410718f7f86e8b1b5a4fb0ee1419faa11ccd&dn=computernetwork&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com";

const seed = async () => {
  console.log("seed");
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
  console.log("seeded t", t, t.infoHash);
  return t;
};

const add = async () => {
  console.log("add");

  // const p = new Promise((resolve, reject) => {
  //   try {
  //     window.webtorrent.add(TEST_MAGNET_URI, undefined, (torrent) => {
  //       console.log("TESTING CLIENT:", torrent.infoHash, torrent);
  //       // torrent.pause();

  //       let i = 0;
  //       const s = setInterval(async () => {
  //         i++;
  //         console.log("debug t", torrent._peers, torrent.progress);
  //         // if (torrent.progress == 1) {
  //         //   clearInterval(s);
  //         // }
  //         if (i == 5) {
  //           clearInterval(s);
  //           torrent.pause();
  //           resolve(torrent);
  //         }
  //       }, 1000);
  //     });
  //   } catch (e) {
  //     console.log("Error seeding", e);
  //     reject();
  //   }
  // });

  // await p;

  const torrent = window.webtorrent.add(magnetURI, undefined, (torrent) => {
    // Got torrent metadata!
    console.log("Client is downloading:", torrent.infoHash, torrent);
    for (const file of torrent.files) {
      console.log(file.name);
    }

    const s = setInterval(async () => {
      console.log(
        "debug t",
        torrent._peers,
        Object.keys(torrent._peers),
        torrent.progress,
      );
      if (torrent.progress == 1) {
        clearInterval(s);
      }
    }, 1000);
  });
};

(async () => {
  window.webtorrent = new WebTorrent();
  console.log("webtorrent", window.webtorrent, window.webtorrent.peerId);

  // try {
  //   await seed();
  // } catch (e) {
  //   console.log(e);
  // }

  await add();
  // const t = await seed();
  // console.log(t);
  // if (!hasmain_torrent) {

  // const hasmain_torrent = window.webtorrent.torrents
  //   .map((t) => t.magnetURI)
  //   .some((uri) => uri == magnetURI);

  // try {
  // if (!)

  // } catch (e) {
  //   console.log("meh", e);
  // }

  // }

  // t.on("wire", () => {
  //   console.log(wire);
  // });
})();
