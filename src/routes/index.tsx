import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import FeedCard from "~/components/feed-card";

export default component$(() => {
  return (
    <div class="min-h-screen overflow-hidden bg-neutral-950 text-neutral-50">
      <div class="flex flex-col items-center">
        <div class="w-full divide-y divide-neutral-900 border border-neutral-900 md:w-[600px]">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Computer Network",
  meta: [
    {
      name: "description",
      content: "A decentralized app",
    },
  ],
};
