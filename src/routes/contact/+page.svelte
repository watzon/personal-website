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
    { title: "Mastodon", link: "https://tty0.social/@watzon" },
    { title: "Bluesky", link: "https://bsky.app/profile/watzon.tech" },
    { title: "LinkedIn", link: "https://linkedin.com/in/watzon1993" },
    { title: "Blog", link: "/blog" },
    { title: "RSS Feed", link: "/blog/rss.xml", rel: "external" },
    { title: "Atom Feed", link: "/blog/atom.xml", rel: "external" },
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

<svelte:head>
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://watzon.tech/contact">
  <meta property="og:title" content="Chris Watson - Contact">
  <meta property="og:description" content="Contact Chris Watson, Senior Software Engineer - Salt Lake City, UT">
  <meta property="og:image" content="https://watzon.tech/images/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Chris Watson - Senior Software Engineer - Salt Lake City, UT">
  <meta property="og:site_name" content="watzon.tech">
</svelte:head>

<div class="space-y-8">
  <h1 class="text-3xl font-bold mb-6">Contact</h1>

  <section>
    <div class="grid grid-cols-2">
      {#each contactMethods as method}
        <div>
          <h2 class="text-xl font-semibold">{method.title}</h2>
          {#if method.link}
            <a href={method.link} class="text-teal-600 dark:text-teal-400 hover:underline"
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
          <a
            href={link.link}
            class="text-teal-600 dark:text-teal-400 hover:underline"
            rel={link.rel}
          >
            {link.title}
          </a>
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
              class="font-mono text-sm text-teal-600 dark:text-teal-400 hover:underline"
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
