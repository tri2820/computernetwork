import type { NoSerialize, PropFunction } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { LuLoader2, LuX } from "@qwikest/icons/lucide";
import { v4 as uuidv4 } from "uuid";
import type { Torrent } from "webtorrent";
import { INFO_HASH_REGEX, MEDIA_EXTENSIONS, add, humanFileSize, tif } from "~/lib/utils";
import type { FileInfo } from "~/app";
import { GlobalContext } from "~/routes/layout";

interface PostAttachmentProps {
  onDeleteClick$?: PropFunction<() => void>;
  file: FileInfo & { magnetURI?: string };
}

export default component$((props: PostAttachmentProps) => {
  const globalContext = useContext(GlobalContext);
  const processed = useSignal(false);
  const loading = useSignal(false);
  const open = useSignal(false);
  // const type = useSignal<'image' | 'video' | 'audio'>();
  const containerId = useSignal(`torrent-container-${uuidv4()}`);
  const magnetURI = props.file.magnetURI;
  const infoHash = magnetURI?.match(INFO_HASH_REGEX)?.[1];
  const torrent = useSignal<NoSerialize<Torrent>>();

  // const imageRef = useSignal<HTMLMediaElement>();
  // const videoRef = useSignal<HTMLMediaElement>();

  const process = $((t: Torrent) => {
    processed.value = true;
    const f = t.files.at(0);
    if (!f) return;

    // (() => {
    //   const isImage = MEDIA_EXTENSIONS.image.some((ext) =>
    //     f.name.endsWith(ext),
    //   );

    //   if (isImage) {
    //     type.value = 'image'
    //     return;
    //   }

    //   const isVideo = MEDIA_EXTENSIONS.video.some((ext) =>
    //     f.name.endsWith(ext),
    //   );

    //   if (isVideo) {
    //     type.value = 'video'

    //     return;
    //   }
    // })()

    f.appendTo(
      document.getElementById(containerId.value)!
    )
    open.value = true;
  });

  return (
    <div class="group relative ">
      <div class="overflow-hidden rounded-xl border border-neutral-800">
        <button
          onClick$={async () => {
            if (torrent.value) {
              open.value = !open.value;
              return;
            }

            console.log(infoHash);
            if (!infoHash) {
              console.log(
                "No infohash, maybe because file is yet to be uploaded?",
                magnetURI,
              );
              return;
            }

            const t = globalContext.webtorrent!.torrents.find(
              (t) => t.infoHash == infoHash,
            );

            if (t && !processed.value) {
              torrent.value = noSerialize(t);
              process(t);
              return;
            }

            loading.value = true;
            const { torrentAwait } = add(
              magnetURI,
              globalContext.webtorrent!,
              globalContext.table_torrent_metadata,
            );
            const _t = await torrentAwait;
            if (!_t) {
              // TODO: load error
              return;
            }

            process(_t);
            const interval = setInterval(() => {
              console.log(_t, _t.downloaded, _t.progress);
              if (_t.downloaded) {
                clearInterval(interval);
                torrent.value = noSerialize(_t);
                loading.value = false;
              }
            }, 1000);
          }}
          class="flex  w-full items-center space-x-2  bg-neutral-900 px-4 py-2 text-left hover:bg-neutral-800"
        >
          <div class="flex-1">
            <p class="line-clamp-1 text-sm">{props.file.name}</p>
            <p class="text-xs text-neutral-500">
              {props.file.type} • {humanFileSize(props.file.size)}
            </p>
          </div>

          {loading.value && <LuLoader2 class="w4 h-4 flex-none animate-spin" />}
        </button>
        <div
          class="max-h-[600px] overflow-hidden"
          style={{
            display: open.value ? "block" : "none",
          }}
          id={containerId.value}
        >
          {/* <img ref={imageRef} class={"w-full" + tif(type.value == 'image', '', 'hidden')} />
          <video ref={videoRef} class={"w-full" + tif(type.value == 'video', '', 'hidden')} /> */}
        </div>
      </div>

      {props.onDeleteClick$ && (
        <button
          onClick$={props.onDeleteClick$}
          class="absolute -right-2 -top-2 hidden rounded-full bg-black p-1 transition hover:scale-110 group-hover:block"
        >
          <LuX class="h-3 w-3 text-white" />
        </button>
      )}
    </div>
  );
});
