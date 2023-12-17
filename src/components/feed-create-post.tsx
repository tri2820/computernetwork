import { $, component$, useContext, useSignal } from "@builder.io/qwik";

import { Form } from "@builder.io/qwik-city";
import { LuFilePlus2 } from "@qwikest/icons/lucide";
import { GlobalContext } from "~/routes/layout";
import RandomAvatar from "./random-avatar";

export default component$(() => {
  const content = useSignal<string>();
  const globalContext = useContext(GlobalContext);

  const onSubmit = $((e: Event) => {
    if (!content.value) {
      console.log("nothing to submit");
      return;
    }

    if (!globalContext.wires) {
      console.log("no wire to submit");
      return;
    }

    const data = {
      content: content.value.trim(),
      date: new Date().toISOString(),
    };

    globalContext.wires.forEach((w) => {
      w.t_computernetwork.send({
        data,
        privateKey: globalContext.privateKey,
        publicKey: globalContext.publicKey,
      });
    });
    content.value = undefined;
  });

  return (
    <div class="flex space-x-4 p-4">
      <div class="flex-none">
        <RandomAvatar />
      </div>

      <Form
        class="ml-2 flex-1 space-y-2"
        action={true as any}
        onSubmit$={onSubmit}
      >
        <textarea
          name="content"
          bind:value={content}
          class="h-24 w-full resize-none border-b border-neutral-900 bg-transparent text-xl outline-none ring-transparent
        placeholder:text-neutral-500
        "
          placeholder="What's on your mind?"
        />

        <div class="flex items-center">
          <button class="flex flex-1 items-center space-x-1 text-neutral-500 transition hover:text-white">
            <LuFilePlus2 class="h-4 w-4 flex-none" />
            <p>Add File</p>
          </button>

          <button
            onClick$={() => {}}
            type="submit"
            class="flex flex-none items-center space-x-1 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white"
          >
            <p>Post</p>
          </button>
        </div>
      </Form>
    </div>
  );
});
