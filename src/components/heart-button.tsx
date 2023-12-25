import type { NoSerialize, QRL, Signal } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  useOn,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { HiHeartOutline } from "@qwikest/icons/heroicons";
import { Payload } from "~/app";
import { tif, ts_unix_now } from "~/lib/utils";

export type HeartButtonProps = {
  onClick?: QRL<() => void>;
  count: Signal<number>;
  hearted: Signal<boolean>;
};

export default component$(({ onClick, count, hearted }: HeartButtonProps) => {
  const elId = useSignal(`heart-${Math.random()}`);
  const animation = useSignal<NoSerialize<any>>(null);
  const clicked = useSignal(false);

  useVisibleTask$(async () => {
    console.log("debug load animation");
    const anim = window.bodymovin.loadAnimation({
      container: document.getElementById(elId.value),
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "/heart-animation.json",
    });

    animation.value = noSerialize(anim);
    // Animation has 86 frames in total
    animation.value.goToAndStop(86, true)
  });

  const handleButtonClicked = $(() => {
    clicked.value = true;
    if (!hearted.value) {
      animation.value?.goToAndPlay(0, true);
    }
    onClick?.();
  });


  return (
    <div class="flex items-center space-x-1 ">
      <div class="relative">
        <HiHeartOutline
          class={
            "peer h-5 w-5 cursor-pointer text-neutral-500 transition hover:text-white" +
            tif(hearted.value, "opacity-0") +
            tif(!hearted.value && clicked.value, "animate-wiggle")
          }
          onClick$={handleButtonClicked}
        />
        <div
          id={elId.value}
          class={
            "pointer-events-none absolute left-0 top-0 ml-0.5 mt-[1px] h-36 w-36 -translate-x-16 -translate-y-16 transition peer-hover:brightness-150" +
            tif(!hearted.value, "opacity-0")
          }
        />
      </div>
      <div class="select-none leading-none text-neutral-500">
        <p>{count.value}</p>
      </div>
    </div>
  );
});
