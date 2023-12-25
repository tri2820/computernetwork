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
import { INFO_HASH_REGEX, MEDIA_EXTENSIONS, add } from "~/lib/utils";
import type { FileInfo } from "~/app";
import { GlobalContext } from "~/routes/layout";

interface PostAttachmentProps {
  onDeleteClick$?: PropFunction<() => void>;
  file: FileInfo & { magnetURI?: string };
}

export default component$((props: PostAttachmentProps) => {
  const globalContext = useContext(GlobalContext);
  const appened = useSignal(false);
  const loading = useSignal(false);
  const open = useSignal(false);
  // const containerId = useSignal(`container-${uuidv4()}`);
  const magnetURI = props.file.magnetURI;
  const infoHash = magnetURI?.match(INFO_HASH_REGEX)?.[1];
  const torrent = useSignal<NoSerialize<Torrent>>();

  const imageRef = useSignal<HTMLMediaElement>();

  const process = $((t: Torrent) => {
    appened.value = true;
    t.files.forEach((file) => {
      const isActuallyImage = MEDIA_EXTENSIONS.image.some((ext) =>
        file.name.endsWith(ext),
      );
      if (!isActuallyImage) return;
      file.renderTo(imageRef.value!);
      open.value = true;
    });
  });

  return (
    <div class="group relative overflow-hidden">
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

            if (t && !appened.value) {
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
              {props.file.type} • {props.file.size}
            </p>
          </div>

          {loading.value && <LuLoader2 class="w4 h-4 flex-none animate-spin" />}
        </button>
        <div
          // id={containerId.value}
          class="max-h-[600px] overflow-hidden "
          style={{
            display: open.value ? "block" : "none",
          }}
        >
          <img ref={imageRef} class="w-full" />
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
