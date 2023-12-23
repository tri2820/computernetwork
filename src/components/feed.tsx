import { component$, useContext } from "@builder.io/qwik";
import { GlobalContext } from "~/routes/layout";
import FeedCard from "./feed-card";
import FeedCreatePost from "./feed-create-post";

export default component$(() => {
  const globalContext = useContext(GlobalContext);

  return (
    <div class="w-full flex-1 divide-y  divide-neutral-900 border-x border-neutral-900 md:w-[600px]">
      <FeedCreatePost />

      {globalContext.posts?.map((x) => <FeedCard key={x.id} post={x} />)}
    </div>
  );
});
