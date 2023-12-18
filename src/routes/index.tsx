import { component$, useContext, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Feed from "~/components/feed";
import FeedCard from "~/components/feed-card";
import { GlobalContext } from "./layout";
import { uint8ArrayToString } from "~/lib/utils";
import { LuCog } from "@qwikest/icons/lucide";
import TopBar from "~/components/top-bar";
import DmButton from "~/components/dm-button";

export default component$(() => {
  return (
    <>
      <DmButton />
      <div class="flex flex-1 flex-col items-center overflow-hidden ">
        <Feed />
      </div>
    </>
  );
});
