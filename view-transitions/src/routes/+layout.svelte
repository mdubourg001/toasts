<script lang="ts">
  import "../app.css";
  import { spaNavigate } from "../helpers/navigate";

  export const ssr = false;
</script>

<div>
  <header class="container py-6 mx-auto max-w-[1000px]">
    <h1
      class="text-4xl font-extrabold text-white hover:scale-[1.005] transition-transform"
    >
      <a on:click={() => spaNavigate(`/`)} class="cursor-pointer"
        >Midjourney <span class="font-extralight">Showcase</span></a
      >
    </h1>
  </header>

  <main>
    <slot />
  </main>
</div>
