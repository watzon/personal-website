<script lang="ts">
  import { writable } from "svelte/store";

  const contactMethods = [
    {
      title: "Email",
      value: "chris@watzon.tech",
      link: "mailto:chris@watzon.tech",
    },
    {
      title: "Discord",
      value: "watzon",
      description:
        "Please note that Discord may reject friend requests if you aren't in a mutual server with me. I don't have control over this behavior.",
    },
  ];

  const otherLinks = [
    { title: "GitHub", link: "https://github.com/watzon" },
    { title: "Mastodon", link: "https://watzonmanor.com/@watzon" },
    { title: "LinkedIn", link: "https://linkedin.com/in/watzon1993" },
    { title: "Blog", link: "/blog" },
    { title: "RSS Feed", link: "/rss.xml" },
  ];

  const cryptoAddresses = [
    {
      title: "Ethereum",
      address: "0x6738ad84E30571348a858bc592daf45C0128bFDd",
    },
    {
      title: "Bitcoin",
      address: "bc1qq3htah2gaysdk8335lfazy2n7pm0et3gur08tr",
    },
  ];

  let copiedAddress = writable<string | null>(null);

  function copyToClipboard(address: string) {
    navigator.clipboard.writeText(address);
    copiedAddress.set(address);

    setTimeout(() => {
      copiedAddress.set(null);
    }, 2000);
  }
</script>

<div class="space-y-8">
  <h1 class="text-3xl font-bold mb-6">Contact</h1>

  <section>
    <div class="grid grid-cols-2">
      {#each contactMethods as method}
        <div>
          <h2 class="text-xl font-semibold">{method.title}</h2>
          {#if method.link}
            <a href={method.link} class="text-teal-400 hover:underline"
              >{method.value}</a
            >
          {:else}
            <p>{method.value}</p>
          {/if}
          {#if method.description}
            <p class="text-sm text-gray-400 mt-1">{method.description}</p>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Other useful links:</h2>
    <ul class="list-disc list-inside space-y-2">
      {#each otherLinks as link}
        <li>
          <a href={link.link} class="text-teal-400 hover:underline"
            >{link.title}</a
          >
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">Cryptocurrency</h2>
    <p class="mb-4">
      I accept cryptocurrency donations at the following addresses:
    </p>
    {#each cryptoAddresses as crypto}
      <div class="mb-2">
        <h3 class="text-lg font-semibold">{crypto.title}</h3>
        <div class="flex items-center space-x-2">
            <button
              title="Click to copy address to clipboard"
              class="font-mono text-sm text-teal-400 hover:underline"
              onclick={() => copyToClipboard(crypto.address)}
            >
              {crypto.address}
            </button>
            {#if $copiedAddress === crypto.address}
              <span class="text-gray-400 text-sm">Copied!</span>
            {/if}
        </div>
      </div>
    {/each}
  </section>
</div>
