import type { NoSerialize } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  useContext,
  useSignal,
} from "@builder.io/qwik";

import { LuFilePlus2 } from "@qwikest/icons/lucide";
import { prepareMessage, seed, toPost } from "~/lib/utils";
import type { Payload, FileThroughTorrent, Post } from "~/me";
import { GlobalContext } from "~/routes/layout";
import PostAttachment from "./post-attachment";
import RandomAvatar from "./random-avatar";

export default component$(() => {
  const content = useSignal<string>();
  const file = useSignal<NoSerialize<File>>();
  const globalContext = useContext(GlobalContext);

  const attachmentDelete = $(() => {
    file.value = undefined;
  });

  const reset = $(() => {
    content.value = undefined;
    file.value = undefined;
  });

  const onFileChange = $((e: any) => {
    const files: File[] = [...e.target.files];
    const _file = files.at(0);
    if (!_file) return;
    console.log("file", _file);
    file.value = noSerialize(_file);
  });

  const submit = $(async (e: Event) => {
    if (!content.value) {
      console.log("nothing to submit");
      return;
    }

    let _file: FileThroughTorrent | undefined = undefined;
    if (file.value) {
      if (!globalContext.webtorrent) {
        console.log("no webtorrent instance");
        return;
      }

      const { torrentAwait } = seed(
        file.value,
        globalContext.webtorrent,
        globalContext.TORRENTS_METADATA,
      );

      const torrent = await torrentAwait;
      if (torrent) {
        _file = {
          magnetURI: torrent.magnetURI,
          name: file.value.name,
          type: file.value.type,
          size: file.value.size,
        };
      }
    }

    console.log("prepare");
    const payload: Payload = {
      post: {
        file: _file,
        content: content.value.trim(),
        created_at: new Date().getTime(),
      },
    };

    const { buffer, message } = prepareMessage(
      payload,
      globalContext.private_key!,
      globalContext.public_key!,
    );
    const newPost: Post = toPost(message, payload.post);
    globalContext.posts = [newPost, ...(globalContext.posts ?? [])];

    if (!globalContext.wires) {
      console.log("no wire to submit");
      reset();
      return;
    }

    globalContext.wires.forEach((w) => {
      w.t_computernetwork.send(buffer);
    });

    reset();
  });

  return (
    <div class="flex space-x-4 p-4">
      <div class="flex-none">
        <RandomAvatar />
      </div>

      <div class="ml-2 flex-1 space-y-2">
        <textarea
          name="content"
          bind:value={content}
          class="h-24 w-full resize-none border-b border-neutral-900 bg-transparent text-xl outline-none ring-transparent
        placeholder:text-neutral-500
        "
          placeholder="What's on your mind?"
        />

        <div class="flex items-center space-x-2">
          {file.value ? (
            <div class="flex-1">
              <PostAttachment
                onDeleteClick$={attachmentDelete}
                file={{
                  size: file.value.size,
                  name: file.value.name,
                  type: file.value.type,
                }}
              />
            </div>
          ) : (
            <label class="flex flex-1 cursor-pointer items-center space-x-1 text-neutral-500 transition hover:text-white">
              <LuFilePlus2 class="h-4 w-4 flex-none" />
              <p>Add File</p>
              <input type="file" class="hidden" onChange$={onFileChange} />
            </label>
          )}

          <button
            onClick$={submit}
            type="submit"
            class="flex flex-none items-center space-x-1 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white"
          >
            <p>Post</p>
          </button>
        </div>
      </div>
    </div>
  );
});
