<script lang="ts">
  import Image from "../components/Image.svelte";
  import { spaNavigate } from "../helpers/navigate";
  import type { PageData } from "./$types";

  export let data: PageData;

  function handleImageClick(event: MouseEvent, imageId: string) {
    if (event.target) {
      (event.target as HTMLImageElement).style.viewTransitionName =
        "emphasized";
    }

    spaNavigate(`/${imageId}`);
  }
</script>

<div
  class="container grid grid-cols-4 gap-10 py-10 mx-auto max-w-[1000px] items-center"
>
  {#each data.images as image}
    <!-- Don't blame me, it's currently not possible using native Svelte navigation 🫣 -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="cursor-pointer"
      on:click={(event) => handleImageClick(event, image.id)}
    >
      <Image {image} />
    </a>
  {/each}
</div>
