import type { PropFunction } from "@builder.io/qwik";
import {
  $,
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { LuDownload, LuLoader2, LuX } from "@qwikest/icons/lucide";
import { v4 as uuidv4 } from "uuid";
import type { Torrent } from "webtorrent";
import type { FileInfo } from "~/app";
import { INFO_HASH_REGEX, add, humanFileSize } from "~/lib/utils";
import { GlobalContext } from "~/routes/layout";

interface PostAttachmentProps {
  onDeleteClick$?: PropFunction<() => void>;
  file: FileInfo & { magnetURI?: string };
}

export default component$((props: PostAttachmentProps) => {
  const globalContext = useContext(GlobalContext);
  const processed = useSignal(false);
  const loading = useSignal(false);

  // const type = useSignal<'image' | 'video' | 'audio'>();
  const containerId = useSignal(`torrent-container-${uuidv4()}`);
  const magnetURI = props.file.magnetURI;
  const infoHash = magnetURI?.match(INFO_HASH_REGEX)?.[1];
  const have = useSignal(false);
  const open = useSignal(false);

  // const imageRef = useSignal<HTMLMediaElement>();
  // const videoRef = useSignal<HTMLMediaElement>();

  const process = $((t: Torrent) => {
    processed.value = true;
    const f = t.files.at(0);
    if (!f) return;
    f.appendTo(document.getElementById(containerId.value)!);
    open.value = true;
  });

  useVisibleTask$(() => {
    const t = globalContext.webtorrent?.torrents.find(
      (t) => t.infoHash == infoHash,
    );
    if (!t) return;
    have.value = true;
    process(t);
    open.value = true;
  });

  const addThenToggle = $(async () => {
    if (have.value) {
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

    const t = globalContext.webtorrent?.torrents.find(
      (t) => t.infoHash == infoHash,
    );

    if (t && !processed.value) {
      have.value = true;
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
        have.value = true;
        loading.value = false;
      }
    }, 1000);
  });

  const download = $(() => {
    const t = globalContext.webtorrent?.torrents.find(
      (t) => t.infoHash == infoHash,
    );
    const f = t?.files.at(0);
    if (!f) return;

    f.getBlobURL(function (err, url) {
      if (err) throw err;
      if (!url) return;
      const a = document.createElement("a");
      a.download = f.name;
      a.href = url;
      a.click();
    });
  });

  return (
    <div class="group relative ">
      <div class="overflow-hidden rounded-xl border border-neutral-800">
        {/* <p>{open.value ? "open" : "close"}</p> */}
        <div class="flex items-center bg-neutral-900 px-4 py-2 hover:bg-neutral-800">
          <button
            onClick$={addThenToggle}
            class="flex w-full flex-1 items-center space-x-2   text-left "
          >
            <div class="flex-1">
              <p class="line-clamp-1 text-sm">{props.file.name}</p>
              <p class="text-xs text-neutral-500">
                {props.file.type} • {humanFileSize(props.file.size)}
              </p>
            </div>

            {loading.value && (
              <LuLoader2 class="w4 h-4 flex-none animate-spin" />
            )}
          </button>

          {have.value && (
            <button
              onClick$={download}
              class="flex-none rounded-full  border  border-neutral-500 border-opacity-0 p-2 hover:border-opacity-100 hover:bg-neutral-700"
            >
              <LuDownload class="h-4 w-4" />
            </button>
          )}
        </div>
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
