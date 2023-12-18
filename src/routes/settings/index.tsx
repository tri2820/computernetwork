import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div>
      <p>Avatar</p>
      <input name="name" type="text" placeholder="How people will call you" />

      {/* 
        mention {
            displayName: 'asdasdad',
            userId: '...'
        }
         */}
      <p>Name</p>
      <input name="name" type="text" placeholder="How people will call you" />
    </div>
  );
});
