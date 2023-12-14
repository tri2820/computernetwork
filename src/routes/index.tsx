import { component$, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Feed from "~/components/feed";
import FeedCard from "~/components/feed-card";
import { GlobalContext } from "./layout";

export default component$(() => {
  const globalContext = useContext(GlobalContext);

  return (
    <div class="min-h-screen overflow-hidden bg-neutral-950 text-neutral-50">
      <button class="group absolute bottom-4 right-4 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 transition hover:scale-105">
        <p class="text-neutral-500 group-hover:text-white">
          Connected to{" "}
          {JSON.stringify(
            Object.keys(globalContext.peers.value as object).length,
          )}{" "}
          peers
        </p>
      </button>
      <div class="flex flex-col items-center">
        <Feed />
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
