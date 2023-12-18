import { component$, useContext } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { LuChevronLeft, LuCog } from "@qwikest/icons/lucide";
import { GlobalContext } from "~/routes/layout";

export default component$(() => {
  const globalContext = useContext(GlobalContext);
  const location = useLocation();
  const isSettings = location.url.pathname == "/settings/";

  return (
    <div class="sticky top-0 z-10 flex flex-none  items-center border-b border-neutral-800 bg-neutral-900 px-4 py-2 text-neutral-500">
      <p class="line-clamp-1 flex-1 break-all text-sm">
        Welcome, {globalContext.publicKey_string}
      </p>

      <Link href={isSettings ? "/" : "/settings"} class="group flex-none">
        {isSettings ? (
          <LuChevronLeft class="h-4 w-4 transition-all group-hover:text-white" />
        ) : (
          <LuCog class="h-4 w-4 transition-all group-hover:text-white" />
        )}
      </Link>
    </div>
  );
});
