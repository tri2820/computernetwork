import { component$, useContext } from "@builder.io/qwik";
import { LuFilePlus2 } from "@qwikest/icons/lucide";
import FeedCard from "./feed-card";
import RandomAvatar from "./random-avatar";
import FeedCreatePost from "./feed-create-post";
import { GlobalContext } from "~/routes/layout";

export default component$(() => {
  const globalContext = useContext(GlobalContext);

  return (
    <div class="w-full  divide-y  divide-neutral-900 border-x border-neutral-900 md:w-[600px]">
      <FeedCreatePost />

      <FeedCard />
      <FeedCard />
      <FeedCard />
      <FeedCard />
    </div>
  );
});
