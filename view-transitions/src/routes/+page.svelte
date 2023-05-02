<script lang="ts">
  import Image from "../components/Image.svelte";
  import { spaNavigate } from "../helpers/navigate";
  import type { PageData } from "./$types";

  export let data: PageData;
  let images = data.images;

  function handleImageClick(event: MouseEvent, imageId: string) {
    // if (event.target) {
    //   (event.target as HTMLImageElement).style.viewTransitionName =
    //     "emphasized";
    // }

    spaNavigate(`/${imageId}`);
  }
</script>

<header class="container py-6 mx-auto max-w-[1000px]">
  <h1 class="text-4xl font-extrabold text-white">
    <a on:click={() => spaNavigate(`/`)} class="cursor-pointer"
      >Midjourney <span class="font-extralight">Showcase</span></a
    >
  </h1>
</header>

<div
  class="container grid grid-cols-4 gap-10 py-10 mx-auto max-w-[1000px] items-center"
>
  {#each images as image}
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

<style>
  /* h1 {
    view-transition-name: title;
  } */
</style>
