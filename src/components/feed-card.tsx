import { $, component$, useComputed$, useContext } from "@builder.io/qwik";
import type { Payload, Post } from "~/app";
import HeartButton from "~/components/heart-button";
import {
  addMessagesToStorage,
  stringToUInt8Array,
  ts_unix2js,
  ts_unix_now,
  uint8ArrayToString,
  uint8equal
} from "~/lib/utils";
import { GlobalContext } from "~/routes/layout";
import PostAttachment from "./post-attachment";
import RandomAvatar from "./random-avatar";

export default component$(({ post }: { post: Post }) => {
  const globalContext = useContext(GlobalContext);
  const count = useComputed$(() => {
    if (!globalContext.storage) return 0;
    const c = globalContext.storage.messages.filter(m =>
      m.payload.react
      && m.payload.react.state == 'hearted'
      && uint8ArrayToString(m.payload.react.for_message_hash) == post.id
    ).length;
    return c
  });

  const hearted = useComputed$(() => {
    if (!globalContext.storage) return false;
    const h = globalContext.storage.messages.some(m =>
      m.payload.react
      && m.payload.react.state == 'hearted'
      && uint8ArrayToString(m.payload.react.for_message_hash) == post.id
      && uint8equal(m.public_key, globalContext.identity!.keyPair.publicKey)
    )
    return h
  });

  const onHearted = $(async () => {
    const newHearted = !hearted.value;

    const payload: Payload = {
      react: {
        state: newHearted ? "hearted" : "neutral",
        for_message_hash: stringToUInt8Array(post.id)
      },
    };

    const message = await globalContext.identity!.sign(payload);
    addMessagesToStorage(globalContext, [message]);

    if (!globalContext.wires) {
      console.log("no wire to submit");
      return;
    }

    globalContext.wires.forEach((w) => {
      w.t_computernetwork.send(message);
    });
  });

  return (
    <div class="space-y-3 p-4">
      <div class="flex flex-row items-center space-x-2">
        <RandomAvatar name={post.public_key} />
        <div>
          <p class="line-clamp-1 break-all font-bold">{post.public_key}</p>
          <p class="text-xs text-neutral-400">
            {new Date(ts_unix2js(post.created_at)).toLocaleString("en-US", {
              timeZoneName: "short",
            })}
          </p>
        </div>
      </div>

      <p>{post.content}</p>
      {post.file && <PostAttachment file={post.file} />}
      <HeartButton onClick={onHearted} count={count} hearted={hearted} />
    </div>
  );
});
