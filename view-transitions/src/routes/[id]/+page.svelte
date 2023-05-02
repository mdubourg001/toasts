<script lang="ts">
  import type { PageData } from "./$types";
  import { spaNavigate } from "../../helpers/navigate";

  export let data: PageData;
</script>

<header class="container py-6 mx-auto max-w-[1000px]">
  <h1 class="flex justify-center text-4xl font-extrabold text-white">
    <a on:click={() => spaNavigate(`/`)} class="cursor-pointer"
      >Midjourney <span class="font-extralight">Showcase</span></a
    >
  </h1>
</header>

<div
  class="container flex flex-col items-start py-10 mx-auto gap-y-4 max-w-[1000px]"
>
  <button
    on:click={() => spaNavigate(`/`)}
    class="text-xl text-white text-gray-300">← Back to showcase</button
  >

  <div class="grid grid-cols-5 gap-x-10">
    <img
      id="emphasized"
      src={data.image.image_paths[0]}
      alt=""
      class="col-span-2 rounded-md shadow-lg"
    />
  </div>
</div>

<style>
  /* #emphasized {
    view-transition-name: emphasized;
    contain: layout;
  } */

  /* h1 {
    view-transition-name: title;
  } */
</style>
