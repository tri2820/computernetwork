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
import type { GlobalContextType, Storage } from "~/app";
// @ts-ignore
import idbKVStore from "idb-kv-store";
import { decode, encode } from "cbor-x";
import posthog from "posthog-js";
import { Identity } from "~/lib/identity";
import { uint8ArrayToString } from "~/lib/utils";

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
export default component$(() => {
  const globalContext = useStore<GlobalContextType>({});
  useContextProvider(GlobalContext, globalContext);

  useVisibleTask$(() => {
    posthog.init("phc_zxfbWru5VSVpSu7yN667GZRXAhDYtkSYGbpqI6KNevp", {
      api_host: "https://app.posthog.com",
    });
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
