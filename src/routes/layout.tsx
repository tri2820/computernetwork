import {
  Slot,
  component$,
  createContextId,
  noSerialize,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { DocumentHead, RequestHandler } from "@builder.io/qwik-city";
import WebtorrentService from "~/components/WebtorrentService";
import TopBar from "~/components/top-bar";
import type { GlobalContextType } from "~/me";
// @ts-ignore
import idbKVStore from "idb-kv-store";
import { decode, encode } from "cbor-x";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const GlobalContext = createContextId<GlobalContextType>("global");
const MESSAGES_KEY = "MESSAGES";
export default component$(() => {
  const globalContext = useStore<GlobalContextType>({});
  useContextProvider(GlobalContext, globalContext);

  useVisibleTask$(async () => {
    const store = new idbKVStore("table_local_state");
    globalContext.table_local_state = noSerialize(store);

    const values = await store.get(MESSAGES_KEY);
    console.log("wake up get messages", values);
    if (values) {
      const messages = decode(values);
      globalContext.storage = noSerialize(messages);
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => globalContext.storage);
    const values = encode(globalContext.storage);
    globalContext.table_local_state.set(MESSAGES_KEY, values);
  });

  return (
    <>
      <WebtorrentService />
      <div class="relative flex min-h-screen flex-col bg-neutral-950  text-neutral-50">
        <TopBar />
        <Slot />
      </div>
    </>
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
