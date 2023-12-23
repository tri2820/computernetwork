import { component$ } from "@builder.io/qwik";
import HeartButton from "~/components/heart-button";
import type { Post } from "~/me";
import RandomAvatar from "./random-avatar";
import PostAttachment from "./post-attachment";

export default component$(({ post }: { post: Post }) => {
  return (
    <div class="space-y-3 p-4">
      <div class="flex flex-row items-center space-x-2">
        <RandomAvatar />
        <div>
          <p class="line-clamp-1 break-all font-bold">{post.public_key}</p>
          <p class="text-xs text-neutral-400">
            {new Date(post.created_at).toLocaleString("en-US", {
              timeZoneName: "short",
            })}
          </p>
        </div>
      </div>

      <p>{post.content}</p>
      {post.file && <PostAttachment file={post.file} />}
      <HeartButton />
    </div>
  );
});
