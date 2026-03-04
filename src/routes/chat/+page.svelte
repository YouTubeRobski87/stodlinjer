<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  if (browser) {
    goto('/chat/angest');
  }
</script>

<svelte:head>
  <title>Chat – MittPsyke</title>
</svelte:head>

<main style="padding:16px">
  <p>Skickar dig till chatten…</p>
  <p><a href="/chat/angest">Öppna chatten</a></p>
</main>
