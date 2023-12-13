import type { NoSerialize } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  useOn,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
// import Lottie from "lottie-react";
// import { useEffect, useRef, useState } from "react";
import heartAnimation from "../../public/heart-animation.json";
// import { HeartIcon } from "@heroicons/react/24/outline";
// import dynamic from "next/dynamic";
// import { LottieRef } from "lottie-react";
import { HiHeartOutline } from "@qwikest/icons/heroicons";

const tif = (cond: boolean, classNamesTrue: string, classNamesFalse = "") => {
  return cond ? ` ${classNamesTrue} ` : ` ${classNamesFalse} `;
};
// import { QwikLottie } from "qwik-lottie";

// const DynamicLottie = dynamic(() => import("lottie-react"), {
//   //   loading: () => <p>Loading...</p>,
// });

export default component$(() => {
  const elId = useSignal(`heart-${Math.random()}`);
  const animation = useSignal<NoSerialize<any>>(null);

  useOn(
    "qvisible",
    $(async () => {
      const anim = window.bodymovin.loadAnimation({
        container: document.getElementById(elId.value),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/heart-animation.json",
      });

      animation.value = noSerialize(anim);
    }),
  );

  const hearted = useSignal(false);
  const clicked = useSignal(false);
  const count = useSignal(0);

  const handleButtonClicked = $(() => {
    clicked.value = true;

    hearted.value = !hearted.value;
    count.value = hearted.value ? 1 : 0;
    const frame = animation.value?.getDuration(true);
    console.log(frame);

    if (hearted.value) {
      animation.value?.goToAndPlay(0, true);
    }
  });

  return (
    <div class="flex items-center space-x-1">
      <div class="relative ">
        <HiHeartOutline
          class={
            "peer/hearticon h-5 w-5 cursor-pointer text-neutral-300 hover:brightness-150" +
            tif(hearted.value, "opacity-0") +
            tif(!hearted.value && clicked.value, "animate-wiggle")
          }
          onClick$={handleButtonClicked}
        />
        <div
          id={elId.value}
          class={
            "pointer-events-none absolute left-0 top-0 ml-0.5 mt-[1px] h-36 w-36 -translate-x-16 -translate-y-16" +
            tif(!hearted.value, "opacity-0")
          }
        />
      </div>
      <div class="select-none leading-none">
        <p>{count.value}</p>
      </div>
    </div>
  );
});
