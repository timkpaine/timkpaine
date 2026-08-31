<script lang="ts">
  import type { EnhancedPicture } from '$lib/posts';

  type Props = {
    /** An image imported with `?enhanced`, or a plain URL for remote images. */
    src: EnhancedPicture | string;
    alt: string;
    caption?: string;
    /** Let the figure break out of the prose column. */
    wide?: boolean;
    loading?: 'lazy' | 'eager';
  };

  let { src, alt, caption, wide = false, loading = 'lazy' }: Props = $props();
</script>

<figure class="not-prose my-10" class:figure-wide={wide}>
  {#if typeof src === 'string'}
    <img class="w-full rounded-lg border border-line" {src} {alt} {loading} decoding="async" />
  {:else}
    <picture>
      {#each Object.entries(src.sources) as [format, srcset]}
        <source {srcset} type="image/{format}" />
      {/each}
      <img
        class="w-full rounded-lg border border-line"
        src={src.img.src}
        width={src.img.w}
        height={src.img.h}
        {alt}
        {loading}
        decoding="async"
      />
    </picture>
  {/if}
  {#if caption}
    <figcaption class="mt-3 text-center text-sm leading-relaxed text-muted">{caption}</figcaption>
  {/if}
</figure>
