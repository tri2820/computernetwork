import type { NoSerialize } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  useOn,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { HiHeartOutline } from "@qwikest/icons/heroicons";

const tif = (cond: boolean, classNamesTrue: string, classNamesFalse = "") => {
  return cond ? ` ${classNamesTrue} ` : ` ${classNamesFalse} `;
};

export default component$(() => {
  const elId = useSignal(`heart-${Math.random()}`);
  const animation = useSignal<NoSerialize<any>>(null);

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
  });

  const hearted = useSignal(false);
  const clicked = useSignal(false);
  const count = useSignal(0);

  const handleButtonClicked = $(() => {
    clicked.value = true;

    hearted.value = !hearted.value;
    count.value = hearted.value ? 1 : 0;
    const frame = animation.value?.getDuration(true);
    console.log("frame", frame);

    if (hearted.value) {
      animation.value?.goToAndPlay(0, true);
    }
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
