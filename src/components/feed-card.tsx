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

      <div class="flex space-x-4 rounded bg-[#d8d8e1] p-4">
        <button class="group relative flex-none">
          <image
            class="rounded "
            src="/random-album-cover.jpeg"
            width={128}
            height={128}
            alt="Album Cover"
          />

          <div class="absolute left-10 top-10 rounded-full border border-white bg-neutral-900/40 p-3 opacity-80 transition group-hover:opacity-100">
            <LuPlay class="h-6 w-6" fill="white" />
          </div>
        </button>

        <div class="flex flex-1 flex-col text-[#292b4a]">
          <div class="flex-1 space-y-1">
            <div class="flex items-center ">
              <div class="flex flex-1 items-center space-x-2">
                <p class="line-clamp-1 text-xl font-bold">Yana</p>
                <div class="rounded-full bg-[#b9b9c9] px-3 py-0.5">
                  <p class="text-xs">Pop</p>
                </div>
              </div>

              <div class="flex flex-row items-center space-x-1">
                <LuHeadphones class="h-4 w-4 flex-none" />
                <p class="text-xs">2.39K</p>
              </div>
            </div>

            <p class="line-clamp-1 text-sm">Gho$t Boi Ön Da Traxk + 1 other</p>
          </div>
          {/* <p class="text-sm">03:45</p> */}

          <audio controls class="w-full flex-none">
            {/* <source src="horse.ogg" type="audio/ogg">
                <source src="horse.mp3" type="audio/mpeg"> */}
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>

      <HeartButton />
    </div>
  );
});
