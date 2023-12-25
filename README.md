# ComputerNetwork
ComputerNetwork is a decentralized social network built on top of WebTorrent. It enables users to establish browser-to-browser connections to share posts, files, and more.

### How It Works
- Files are stored inside IndexedDB.
- Files are shared using WebTorrent.
- Supports various file types: jpeg, mp3, mp4, html, js, etc.
- A user's identity is created with a private key, randomly generated during their first visit.
- Messages are authenticated by signing them with the user's private key.
- Nodes in the network keep each other updated by exchanging messages.
- Operates over both LAN and the Internet.
- Scalable on a global level (?)

Under the hood, ComputerNetwork uses its own protocol, which is a [Torrent BEP-10 extension](https://www.bittorrent.org/beps/bep_0010.html).

## How to Try It
To try ComputerNetwork, visit https://computernetwork.io. You should be able to see posts from peers over the Internet. Keep your browser tab alive so people could connect to it.

Note: If there are few active nodes, or if your node is behind NAT (Network Address Translation), connections over the Internet may not be possible. In this case, try the local setup as described below.

1. Visit https://computernetwork.io to start node A in your browser.
2. Open an incognito tab, visit https://computernetwork.io for node B.
3. Check the number of connected peers (bottom right); see if A connected to B.
4. If A connected to B, begin sending/receiving messages.

## Development

To start development, use the following commands:
```shell
bun i
bun dev
```

## Production

### Host on Vercel
To deploy on Vercel:
1. Fork this repository.
2. Deploy your site to Vercel via a Git provider or Vercel CLI as detailed in [Vercel's deployment documentation](https://vercel.com/docs/concepts/deployments/overview).

### Self-hosted
To run the app on your own server, execute these commands:
```shell
bun run build.types
bun run lint
bun run build.client
bun run build.server.bun
bun run serve
```

## Inspirations
- [WebTorrent](https://github.com/webtorrent/webtorrent)
- [Nostr](https://github.com/nostr-protocol/nostr)