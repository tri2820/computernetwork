import { component$ } from "@builder.io/qwik";
import HeartButton from "~/components/heart-button";
import type { Post } from "~/me";
import RandomAvatar from "./random-avatar";

export default component$(({ post }: { post: Post }) => {
  return (
    <div class="space-y-3 p-4">
      <div class="flex flex-row items-center space-x-2">
        <RandomAvatar />
        <div>
          <p class="line-clamp-1 break-all font-bold">{post.publicKey}</p>
          <p class="text-xs text-neutral-400">
            {new Date(post.created_at).toDateString()}
          </p>
        </div>
      </div>

      <p>
        {post.content}
        {/* In publishing and graphic design, Lorem ipsum is a placeholder text
        commonly used to demonstrate the visual form of a document or a typeface
        without relying on meaningful content. Lorem ipsum may be used as a
        placeholder before final copy is available. */}
      </p>

      <HeartButton />
    </div>
  );
});
