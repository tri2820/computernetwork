import { component$, useContext, useSignal } from "@builder.io/qwik";
import { LuGithub } from "@qwikest/icons/lucide";
import { uint8ArrayToString } from "~/lib/utils";
import { GlobalContext } from "~/routes/layout";

export default component$(() => {
  const globalContext = useContext(GlobalContext);
  const open = useSignal(false);

  return (
    <div class="fixed bottom-0 right-0 z-10 mb-4 mr-4 space-y-2">
      <div class="flex flex-col items-end">
        <a
          href="https://github.com/tri2820/computernetwork"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button class="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 transition hover:bg-neutral-800">
            <LuGithub class="h-4 w-4 text-neutral-500 transition group-hover:text-white" />
          </button>
        </a>
      </div>

      <div class="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <button
          onClick$={() => {
            open.value = !open.value;
          }}
          class="group w-full px-4 py-2 transition hover:bg-neutral-800"
        >
          <p class="line-clamp-1 text-sm text-neutral-500 transition group-hover:text-white">
            Connected to {globalContext.wires?.length ?? 0} peers
          </p>
        </button>

        {open.value && (
          <ul class="space-y-2 border-t border-neutral-800 px-4 py-2">
            {globalContext.wires?.map((wire) => (
              <li
                key={wire.peerId}
                class="line-clamp-1 break-all text-neutral-400 transition hover:text-white"
              >
                {(wire as any).peerExtendedHandshake.public_key
                  ? uint8ArrayToString(
                      (wire as any).peerExtendedHandshake.public_key,
                    )
                  : "Seeder"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});
