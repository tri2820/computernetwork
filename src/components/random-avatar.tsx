import { component$ } from "@builder.io/qwik";
// @ts-ignore
import { Avatar } from "@boringer-avatars/qwik";

export default component$((props: { name: string }) => {
  return <Avatar size={48} variant="beam" name={props.name} square={false} />;
});
