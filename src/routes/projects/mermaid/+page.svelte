<script lang="ts">
  import { onMount } from 'svelte';
  import mermaid from 'mermaid';
  import Expand from '$lib/icons/Expand.svelte';

  let diagramSource = $state(`graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`);
  let diagramContainer: HTMLElement;
  let error = $state('');
  let mounted = $state(false);
  let isExpanded = $state(false);
  let isDragging = $state(false);
  let startX = 0;
  let startY = 0;
  let translateX = $state(0);
  let translateY = $state(0);
  let scale = $state(1);
  let downloadLink: HTMLAnchorElement;

  const tips = [
    { desc: 'Use for top-down graphs', code: 'graph TD' },
    { desc: 'Use for left-right graphs', code: 'graph LR' },
    { desc: 'Connect nodes with arrows using', code: '-->' },
    { desc: 'Create decision nodes with', code: '{}' },
    { desc: 'Style nodes using', code: '[] or ()' }
  ];

  onMount(() => {
    mounted = true;
    initializeMermaid();
  });

  function initializeMermaid() {
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      theme: isDark ? 'dark' : 'default',
      startOnLoad: false,
      securityLevel: 'loose',
      suppressErrorRendering: true
    });
  }

  function handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) return; // Only handle left mouse button
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    const svg = diagramContainer.querySelector('svg');
    if (svg) svg.style.cursor = 'grabbing';
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  }

  function handleMouseUp() {
    isDragging = false;
    const svg = diagramContainer.querySelector('svg');
    if (svg) svg.style.cursor = 'grab';
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = -e.deltaY;
    const scaleChange = delta > 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(scale * scaleChange, 0.1), 5);
    
    // Calculate mouse position relative to the container
    const rect = diagramContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate new position to zoom towards mouse
    const scaleDiff = newScale - scale;
    translateX -= (mouseX - translateX) * (scaleDiff / scale);
    translateY -= (mouseY - translateY) * (scaleDiff / scale);
    
    scale = newScale;
    updateTransform();
  }

  function updateTransform() {
    const svg = diagramContainer.querySelector('svg');
    if (!svg) return;
    
    const container = svg.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const bbox = svg.getBBox();
    
    // Only center and scale if no transform applied yet
    if (translateX === 0 && translateY === 0 && scale === 1) {
      const scaleX = containerRect.width / bbox.width;
      const scaleY = containerRect.height / bbox.height;
      scale = Math.min(scaleX, scaleY);
      
      // No need for translation as the SVG is already centered
      translateX = 0;
      translateY = 0;
    }

    // Apply transform on top of the centering transform
    svg.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetView() {
    translateX = 0;
    translateY = 0;
    scale = 1;
    updateTransform();
  }

  function downloadSVG() {
    const svg = diagramContainer.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    downloadLink.href = url;
    downloadLink.download = 'diagram.svg';
    downloadLink.click();
    
    URL.revokeObjectURL(url);
  }

  async function downloadPNG() {
    const svg = diagramContainer.querySelector('svg');
    if (!svg) return;
    
    // Get the SVG dimensions
    const bbox = svg.getBBox();
    const width = bbox.width;
    const height = bbox.height;
    
    // Create a copy of the SVG with proper dimensions
    const svgClone = svg.cloneNode(true) as SVGElement;
    svgClone.setAttribute('width', width.toString());
    svgClone.setAttribute('height', height.toString());
    
    // Serialize with correct dimensions and create a data URL
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

    // Create image and canvas
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up image load handler
    img.onload = () => {
      // Use a scale factor for better quality
      const scale = 2;
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      // Set background
      ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#374151' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image scaled up for better quality
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      try {
        const pngUrl = canvas.toDataURL('image/png');
        downloadLink.href = pngUrl;
        downloadLink.download = 'diagram.png';
        downloadLink.click();
      } catch (e) {
        console.error('Failed to create PNG:', e);
        error = 'Failed to create PNG image';
      }
    };
    
    img.src = svgDataUrl;
  }

  async function copyToClipboard() {
    const svg = diagramContainer.querySelector('svg');
    if (!svg) return;

    try {
      // Get SVG data with proper dimensions
      const bbox = svg.getBBox();
      const svgClone = svg.cloneNode(true) as SVGElement;
      svgClone.setAttribute('width', bbox.width.toString());
      svgClone.setAttribute('height', bbox.height.toString());
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create image and set up load handler
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        // Use a scale factor for better quality
        const scale = 2;
        canvas.width = bbox.width * scale;
        canvas.height = bbox.height * scale;
        
        // Set background
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#374151' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the image scaled up for better quality
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        try {
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve as BlobCallback));
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob
            })
          ]);

          // Show success message
          const button = diagramContainer.querySelector('[data-copy-button]');
          if (button) {
            const originalText = button.textContent || '';
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.textContent = originalText;
            }, 2000);
          }
        } catch (e) {
          console.error('Failed to copy image:', e);
          error = 'Failed to copy image to clipboard';
        }
      };

      img.src = svgDataUrl;
    } catch (e) {
      console.error('Failed to copy:', e);
      error = 'Failed to copy diagram to clipboard';
    }
  }

  async function renderDiagram() {
    if (!mounted || !diagramContainer) return;
    
    try {
      error = '';
      diagramContainer.innerHTML = '';
      const { svg } = await mermaid.render('diagram-' + Date.now(), diagramSource);
      diagramContainer.innerHTML = svg;

      // Setup the SVG for panning and zooming
      const svgElement = diagramContainer.querySelector('svg');
      if (svgElement) {
        svgElement.style.maxWidth = '100%';
        svgElement.style.height = '100%';
        svgElement.style.cursor = 'grab';
        svgElement.style.transformOrigin = '0 0';
        svgElement.style.position = 'absolute';
        svgElement.style.left = '50%';
        svgElement.style.top = '50%';
        svgElement.style.transform = 'translate(-50%, -50%)';
        updateTransform();
      }

      // Add pan/zoom instructions and control buttons
      const controls = document.createElement('div');
      controls.className = 'absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap';
      controls.innerHTML = `
        <span class="pointer-events-none">🖱️ Pan: drag | Zoom: scroll</span>
        <div class="flex gap-2">
          <button class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            Reset View
          </button>
          <button class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors" data-copy-button>
            Copy
          </button>
          <button class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            SVG
          </button>
          <button class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            PNG
          </button>
        </div>
      `;

      // Add event listeners to buttons
      const [resetBtn, copyBtn, svgBtn, pngBtn] = controls.querySelectorAll('button');
      resetBtn.addEventListener('click', resetView);
      copyBtn.addEventListener('click', copyToClipboard);
      svgBtn.addEventListener('click', downloadSVG);
      pngBtn.addEventListener('click', downloadPNG);

      diagramContainer.appendChild(controls);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to render diagram';
    }
  }

  // Re-render when the source changes or when mounted changes
  $effect(() => {
    if (mounted && diagramContainer) {
      renderDiagram();
    }
  });

  // Re-initialize and re-render when theme changes
  $effect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          initializeMermaid();
          renderDiagram();
        }
      });
    });

    if (mounted) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return () => observer.disconnect();
  });
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<a 
  bind:this={downloadLink}
  class="hidden"
  rel="noopener noreferrer"
  target="_blank"
  aria-label="Download diagram"
></a>

<div class="space-y-8">
  <section class="bg-neutral-300 dark:bg-gray-800 p-6 rounded-lg">
    <h1 class="text-2xl font-bold mb-4">Mermaid Chart Visualizer</h1>
    <p class="text-sm mb-4">
      Create and visualize diagrams using Mermaid syntax. The visualizer automatically updates as you type
      and supports both light and dark themes. Pan and zoom the diagram using your mouse.
    </p>
  </section>

  <div class="grid grid-cols-1 {isExpanded ? '' : 'md:grid-cols-2'} gap-6">
    <div class="space-y-4 {isExpanded ? 'hidden' : ''}">
      <h2 class="text-xl font-semibold">Diagram Source</h2>
      <textarea
        class="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
        bind:value={diagramSource}
        placeholder="Enter your Mermaid diagram code here..."
      ></textarea>
      {#if error}
        <div class="text-red-600 dark:text-red-400 text-sm">{error}</div>
      {/if}
    </div>

    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Preview</h2>
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div 
        class="bg-white dark:bg-gray-700 p-4 rounded-lg aspect-square relative overflow-hidden"
        onmousedown={handleMouseDown}
        onmousemove={handleMouseMove}
        onmouseup={handleMouseUp}
        onmouseleave={handleMouseUp}
        onwheel={handleWheel}
        aria-label="Diagram container"
        role="img"
      >
        <button
          class="absolute top-1.5 right-1.5 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors z-10"
          onclick={() => isExpanded = !isExpanded}
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          <Expand
            size={20}
            class="transform transition-transform {isExpanded ? 'rotate-180' : ''}"
          />
        </button>
        <div bind:this={diagramContainer} class="w-full h-full relative"></div>
      </div>
    </div>
  </div>

  <section class="bg-neutral-300 dark:bg-gray-800 p-6 rounded-lg {isExpanded ? 'hidden' : ''}">
    <h2 class="text-xl font-semibold mb-4">Quick Tips</h2>
    <ul class="list-disc list-inside space-y-2 text-sm">
      {#each tips as tip}
        <li>
          {tip.desc} <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">{tip.code}</code>
        </li>
      {/each}
    </ul>
  </section>
</div>
