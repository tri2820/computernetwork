import { component$ } from "@builder.io/qwik";
import { LuFilePlus2 } from "@qwikest/icons/lucide";
import FeedCard from "./feed-card";
import RandomAvatar from "./random-avatar";

export default component$(() => {
  return (
    <div class="w-full  divide-y  divide-neutral-900 border-x border-neutral-900 md:w-[600px]">
      <div class="flex space-x-4 p-4">
        <div class="flex-none">
          <RandomAvatar />
        </div>

        <div class="ml-2 flex-1 space-y-2 ">
          <textarea
            class="h-24 w-full resize-none border-b border-neutral-900 bg-transparent text-xl outline-none ring-transparent
            placeholder:text-neutral-500
            "
            placeholder="What's on your mind?"
          />

          <div class="flex items-center">
            <button class="flex flex-1 items-center space-x-1 text-neutral-500 transition hover:text-white">
              <LuFilePlus2 class="h-4 w-4 flex-none" />
              <p>Add File</p>
            </button>

            <button class="flex flex-none items-center space-x-1 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
              <p>Post</p>
            </button>
          </div>
        </div>
      </div>

      <FeedCard />
      <FeedCard />
      <FeedCard />
      <FeedCard />
    </div>
  );
});
