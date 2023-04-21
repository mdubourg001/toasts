<script lang="ts">
  import type { PageData } from "./$types";
  import { spaNavigate } from "../../helpers/navigate";

  export let data: PageData;
</script>

<div
  class="container flex flex-col items-start py-10 mx-auto gap-y-4 max-w-[1000px]"
>
  <button
    on:click={() => spaNavigate(`/`)}
    class="text-xl text-white hover:scale-[1.02] transition-transform text-gray-300"
    >← Back to showcase</button
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
  #emphasized {
    view-transition-name: emphasized;
    contain: layout;
  }
</style>
