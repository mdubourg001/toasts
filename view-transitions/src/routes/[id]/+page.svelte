<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="container grid grid-cols-5 py-10 mx-auto gap-x-10">
  <img
    src={data.image.image_paths[0]}
    alt=""
    class="col-span-2 rounded-md shadow-lg"
  />
</div>
