import { component$ } from "@builder.io/qwik";
// @ts-ignore
import { Avatar } from "@boringer-avatars/qwik";

export default component$((props: { name: string; size?: number }) => {
  return (
    <Avatar
      size={props.size ?? 48}
      variant="beam"
      colors={[
        "#fcff00",
        "#00d500",
        "#fc040c",
        "#09eafc",
        "#ffb4dd",
        "#5957c4",
      ]}
      name={props.name}
      square={false}
    />
  );
});
