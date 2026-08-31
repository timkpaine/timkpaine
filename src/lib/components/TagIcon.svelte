<script lang="ts">
  /**
   * Icons for tags that have one. Tags without an entry render as plain text,
   * so adding a tag never requires touching this file.
   */
  let { tag }: { tag: string } = $props();

  const key = $derived(tag.trim().toLowerCase());
</script>

{#if key === 'work in progress'}
  <!--
    An hourglass rather than the more obvious traffic cone: at this size a cone
    is indistinguishable from a capital A.
  -->
  <svg
    class="size-3 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M7 3.8h10l-5 8.2-5-8.2Z" />
    <path d="M7 20.2h10l-5-8.2-5 8.2Z" />
  </svg>
{:else if key === 'old tech'}
  <svg
    class="size-3 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="M12 3.2c-4.1 0-7.3 3-7.3 6.9 0 2.1.9 3.8 2.3 4.9.3.2.5.6.5 1v1.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V16c0-.4.2-.8.5-1 1.4-1.1 2.3-2.8 2.3-4.9 0-3.9-3.2-6.9-7.3-6.9Z"
    />
    <circle cx="9.2" cy="10.4" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="10.4" r="1.5" fill="currentColor" stroke="none" />
    <path d="m12 13 -.8 1.7h1.6L12 13Z" fill="currentColor" stroke="none" />
  </svg>
{/if}
