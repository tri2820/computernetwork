import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <svg
      class="h-12 w-12 flex-none rounded-full"
      viewBox="0 0 36 36"
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
    >
      <mask
        id=":rg:"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="36"
        height="36"
      >
        <rect width="36" height="36" fill="#FFFFFF"></rect>
      </mask>
      <g mask="url(#:rg:)">
        <rect width="36" height="36" fill="#ff005b"></rect>
        <rect
          x="0"
          y="0"
          width="36"
          height="36"
          transform="translate(-5 9) rotate(189 18 18) scale(1)"
          fill="#ffb238"
          rx="36"
        ></rect>
        <g transform="translate(-5 4.5) rotate(-9 18 18)">
          <path d="M13,19 a1,0.75 0 0,0 10,0" fill="#000000"></path>
          <rect
            x="10"
            y="14"
            width="1.5"
            height="2"
            rx="1"
            stroke="none"
            fill="#000000"
          ></rect>
          <rect
            x="24"
            y="14"
            width="1.5"
            height="2"
            rx="1"
            stroke="none"
            fill="#000000"
          ></rect>
        </g>
      </g>
    </svg>
  );
});
