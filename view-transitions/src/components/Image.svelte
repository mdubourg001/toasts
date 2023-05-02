<script lang="ts">
  import { onMount } from "svelte";
  import type { getImage } from "../api/getImage";

  let element: HTMLImageElement;
  export let image: Awaited<ReturnType<typeof getImage>>;

  // onMount(() => {
  //   element.style.viewTransitionName = image?.id as string;
  // });
</script>

<img
  bind:this={element}
  src={image?.image_paths[0]}
  alt={image?.prompt}
  class="rounded-md shadow-lg"
/>
