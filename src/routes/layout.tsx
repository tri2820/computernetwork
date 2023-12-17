import type { Signal } from "@builder.io/qwik";
import {
  component$,
  createContextId,
  noSerialize,
  Slot,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import WebtorrentService from "~/components/WebtorrentService";
import type { GlobalContextType } from "~/me";

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

  return (
    <div>
      <WebtorrentService />
      <Slot />
    </div>
  );
});
