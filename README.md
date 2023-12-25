# ComputerNetwork
ComputerNetwork is a decentralized social network built on top of WebTorrent. It lets users establish browser-to-browser connections and share posts, files, etc., with each other.

### How It Works
- Files are stored inside Indexed DB.
- Files are shared via WebTorrent.
- Supports a variety of file types: jpeg, mp3, mp4, html, js, etc. (you name it).
- A user's identity is a private key, randomly generated on the first visit.
- Messages are signed using a private key to prove authenticity.
- Nodes in the network keep each other updated by sharing messages with each other.
- Can work not only over LAN but also over the Internet.
- Can scale globally (?).

Under the hood, ComputerNetwork uses its own protocol, which is a [Torrent BEP-10 extension](https://www.bittorrent.org/beps/bep_0010.html).

## How to Try It
Visit https://computernetwork.io. If you are lucky, your node will be connected to strangers' nodes over the Internet. Enjoy exploring!

However, if there are only a few active nodes in the network, or if your node is behind a NAT (Network Address Translation), your node might not be able to find other nodes over the Internet.

In those cases, you can still try ComputerNetwork _locally_ as follows:
1. On your browser, visit https://computernetwork.io, this will be node A.
2. Open an anonymous tab, visit https://computernetwork.io, this will be node B.
3. Check how many peers are connected (at the bottom right), and if A has connected to B.
4. If you see more than 0 peers, you can start sending/receiving messages.

## Development

```shell
bun i
bun dev
```

## Production

### Host on Vercel
Fork this repository. This project is ready to be deployed to Vercel. Then you can [deploy your site to Vercel](https://vercel.com/docs/concepts/deployments/overview) either via a Git provider integration or through the Vercel CLI.

### Self-hosted
Run the app on your own server.
```shell
bun run build.types
bun run lint
bun run build.client
bun run build.server.bun
bun run serve
```