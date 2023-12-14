// import HeartButton from "@/components/heart-button";

// import { Headphones, PlayIcon } from "lucide-react";
// import Image from "next/image";
import { component$ } from "@builder.io/qwik";
import { LuHeadphones, LuPlay } from "@qwikest/icons/lucide";
import HeartButton from "~/components/heart-button";
import RandomAvatar from "./random-avatar";

export default component$(() => {
  return (
    <div class="space-y-3 p-4">
      <div class="flex flex-row items-center space-x-2">
        <RandomAvatar />
        <div>
          <p class="font-bold">Random Musician</p>
          <p class="text-xs text-neutral-400">randommusician@thirdcloud.org</p>
        </div>
      </div>

      <p>
        In publishing and graphic design, Lorem ipsum is a placeholder text
        commonly used to demonstrate the visual form of a document or a typeface
        without relying on meaningful content. Lorem ipsum may be used as a
        placeholder before final copy is available.
      </p>

      <HeartButton />
    </div>
  );
});
