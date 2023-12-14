import { component$ } from "@builder.io/qwik";
import FeedCard from "./feed-card";
import RandomAvatar from "./random-avatar";
import { LuImagePlus, LuMusic2, LuSendHorizontal } from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <div class="w-full  divide-y  divide-neutral-900 border border-neutral-900 md:w-[600px]">
      <div class="flex space-x-4 p-4">
        <div class="flex-none">
          <RandomAvatar />
        </div>

        <div class="deivide-netral-900 flex-1 space-y-2">
          <textarea
            class="h-24 w-full resize-none border-b border-neutral-900 bg-transparent text-xl outline-none ring-transparent
            placeholder:text-neutral-500
            "
            placeholder="What's on your mind?"
          />

          <div class="flex items-center">
            <div class="flex flex-1 items-center space-x-4 text-neutral-500">
              <button class="flex items-center space-x-1 transition hover:text-white">
                <LuImagePlus class="h-4 w-4 flex-none" />
                <p class="truncate">Add Image</p>
              </button>

              <button class="flex items-center space-x-1 transition hover:text-white">
                <LuMusic2 class="h-4 w-4 flex-none" />
                <p class="truncate">Add Audio</p>
              </button>
            </div>

            <button class="flex items-center space-x-1 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white">
              {/* <LuSendHorizontal class="hidden h-4 w-4" /> */}
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
