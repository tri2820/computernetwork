import { component$, useContext, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Feed from "~/components/feed";
import FeedCard from "~/components/feed-card";
import { GlobalContext } from "./layout";

export default component$(() => {
  const globalContext = useContext(GlobalContext);
  const open = useSignal(false);

  return (
    <div class="relative min-h-screen bg-neutral-950 ">
      <div class="sticky top-0 z-10 flex  items-center border-b border-neutral-800 bg-neutral-900 px-4 py-2">
        <p class="line-clamp-1 break-all text-sm text-neutral-500">
          Welcome, {(globalContext.webtorrent.value as any)?.peerId}
        </p>
      </div>

      <div class="overflow-hidden text-neutral-50">
        <div class="fixed bottom-0 right-0 z-10 m-4 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <button
            onClick$={() => {
              open.value = !open.value;
            }}
            class="group w-full px-4 py-2 transition hover:bg-neutral-800"
          >
            <p class="line-clamp-1 text-sm text-neutral-500 transition group-hover:text-white">
              Connected to{" "}
              {JSON.stringify(
                Object.keys(globalContext.peers.value ?? {}).length,
              )}{" "}
              peers
            </p>
          </button>

          {open.value && (
            <ul class="space-y-2 border-t border-neutral-800 px-4 py-2">
              {Object.keys(globalContext.peers.value ?? {}).map((id) => (
                <li
                  key={id}
                  class="line-clamp-1 break-all text-neutral-400 transition hover:text-white"
                >
                  {id}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div class="flex flex-col items-center">
          <Feed />
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
