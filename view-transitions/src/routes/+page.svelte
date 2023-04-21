<script lang="ts">
  import { spaNavigate } from "../helpers/navigate";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div
  class="container grid grid-cols-4 gap-10 py-10 mx-auto max-w-[1000px] items-center"
>
  {#each data.images as image}
    <!-- Don't blame me, it's currently not possible using native Svelte navigation 🫣 -->
    <a class="cursor-pointer" on:click={() => spaNavigate(`/${image.id}`)}>
      <img src={image.image_paths[0]} alt="" class="rounded-md shadow-lg" />
    </a>
  {/each}
</div>
