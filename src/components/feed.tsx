import { component$, useComputed$, useContext } from "@builder.io/qwik";
import { GlobalContext } from "~/routes/layout";
import FeedCard from "./feed-card";
import FeedCreatePost from "./feed-create-post";
import { notEmpty, toPost } from "~/lib/utils";

export default component$(() => {
  const globalContext = useContext(GlobalContext);
  const posts = useComputed$(() => {
    if (!globalContext.storage) return [];
    const _posts = globalContext.storage.messages
      .map((m) => {
        if (!m.payload.data.post) return null;
        const post = toPost(m, m.payload.data.post);
        return post;
      })
      .filter(notEmpty)
    return _posts;
  });

  return (
    <div class="w-full flex-1 divide-y  divide-neutral-900 border-neutral-900 md:w-[600px] md:border-x">
      <FeedCreatePost />
      {posts.value.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}
    </div>
  );
});
