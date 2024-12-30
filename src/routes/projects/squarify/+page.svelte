<script lang="ts">
    import { onMount } from "svelte";
    import UploadIcon from "$lib/icons/Upload.svelte";

    type PresetSize = (typeof sizeOptions)[number]["value"];
    type Size = PresetSize | number;

    let dragActive = $state(false);
    let imageFile = $state<File | null>(null);
    let originalImage = $state<HTMLImageElement | null>(null);
    let backgroundColor = $state<string>("#000000");
    let originalSize = $state({ width: 0, height: 0 });
    let squareSize = $state<Size>("original");
    let customSize = $state<number>(512);
    let previewCanvas = $state<HTMLCanvasElement | null>(null);

    const sizeOptions = [
        { label: "Original Size", value: "original" as const },
        { label: "256×256", value: 256 },
        { label: "512×512", value: 512 },
        { label: "1024×1024", value: 1024 },
    ] as const;

    const colorOptions = [
        { label: "Black", value: "#000000" },
        { label: "White", value: "#FFFFFF" },
        { label: "Light Gray", value: "#94a3b8" },
        { label: "Navy", value: "#0f172a" },
        { label: "Dark Navy", value: "#1e293b" },
        { label: "Teal", value: "#5eead4" },
        { label: "Transparent", value: "transparent" },
    ] as const;

    // Watch for changes in the image, canvas, size, or background color
    $effect(() => {
        const canvas = previewCanvas;
        const image = originalImage;
        const size = squareSize;
        const bg = backgroundColor;

        console.log("Main effect running", { canvas, image, size, bg });

        if (image && canvas) {
            requestAnimationFrame(() => {
                updatePreview();
            });
        }
    });

    // Add paste event listener when component mounts
    onMount(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) processImage(file);
                    break;
                }
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    });

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
    }

    function handleDragEnter(e: DragEvent) {
        e.preventDefault();
        dragActive = true;
    }

    function handleDragLeave(e: DragEvent) {
        e.preventDefault();
        dragActive = false;
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        dragActive = false;
        const file = e.dataTransfer?.files[0];
        if (file) processImage(file);
    }

    function handleFileSelect(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target?.files?.[0];
        if (file) processImage(file);
    }

    function processImage(file: File) {
        if (!file.type.startsWith("image/")) return;

        imageFile = file;
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (!e.target?.result || typeof e.target.result !== "string")
                return;

            const img = new Image();
            img.onload = () => {
                originalSize = { width: img.width, height: img.height };
                originalImage = img;
                // Reset to original size when new image is loaded
                squareSize = "original";
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function getTargetSize(image: HTMLImageElement, size: Size): number {
        if (size === "original") {
            return Math.max(image.width, image.height);
        }
        return size;
    }

    function updatePreview() {
        console.log("updatePreview called");
        if (!originalImage || !previewCanvas) {
            console.log("Missing required elements", {
                originalImage,
                previewCanvas,
            });
            return;
        }

        const ctx = previewCanvas.getContext("2d");
        if (!ctx) {
            console.log("Failed to get canvas context");
            return;
        }

        // Keep preview canvas at fixed display size
        const PREVIEW_SIZE = 596;
        previewCanvas.width = PREVIEW_SIZE;
        previewCanvas.height = PREVIEW_SIZE;

        // Clear previous content
        ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

        // Draw checkered pattern for transparency
        if (backgroundColor === "transparent") {
            const squareSize = 10;
            for (let i = 0; i < PREVIEW_SIZE; i += squareSize) {
                for (let j = 0; j < PREVIEW_SIZE; j += squareSize) {
                    ctx.fillStyle =
                        (i + j) % (squareSize * 2) === 0
                            ? "#ffffff"
                            : "#e2e8f0";
                    ctx.fillRect(i, j, squareSize, squareSize);
                }
            }
        } else {
            // Fill background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
        }

        // Calculate the target square size for the actual output
        const targetSize = getTargetSize(originalImage, squareSize);

        // Calculate scale to fit the preview
        const scale = PREVIEW_SIZE / targetSize;

        // Draw image
        const imageScale =
            Math.min(
                targetSize / originalImage.width,
                targetSize / originalImage.height,
            ) * scale; // Apply preview scaling

        const width = originalImage.width * imageScale;
        const height = originalImage.height * imageScale;
        const x = (PREVIEW_SIZE - width) / 2;
        const y = (PREVIEW_SIZE - height) / 2;

        console.log("Drawing preview:", {
            previewSize: PREVIEW_SIZE,
            targetSize,
            scale,
            imageScale,
            width,
            height,
            x,
            y,
            backgroundColor,
        });

        ctx.drawImage(originalImage, x, y, width, height);
    }

    async function saveImage(): Promise<void> {
        if (!originalImage) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        // Calculate the target square size
        const targetSize = getTargetSize(originalImage, squareSize);

        canvas.width = targetSize;
        canvas.height = targetSize;

        if (backgroundColor !== "transparent") {
            // Fill background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, targetSize, targetSize);
        }

        // Draw image
        const scale = Math.min(
            targetSize / originalImage.width,
            targetSize / originalImage.height,
        );
        const width = originalImage.width * scale;
        const height = originalImage.height * scale;
        const x = (targetSize - width) / 2;
        const y = (targetSize - height) / 2;
        ctx.drawImage(originalImage, x, y, width, height);

        // Download image
        const link = document.createElement("a");
        link.download = "square-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    async function copyImage(): Promise<void> {
        if (!originalImage) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Calculate the target square size
        const targetSize = getTargetSize(originalImage, squareSize);

        canvas.width = targetSize;
        canvas.height = targetSize;

        // Fill background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, targetSize, targetSize);

        // Draw image
        const scale = Math.min(
            targetSize / originalImage.width,
            targetSize / originalImage.height,
        );
        const width = originalImage.width * scale;
        const height = originalImage.height * scale;
        const x = (targetSize - width) / 2;
        const y = (targetSize - height) / 2;
        ctx.drawImage(originalImage, x, y, width, height);

        try {
            const blob = await new Promise<Blob>((resolve) =>
                canvas.toBlob(resolve as BlobCallback),
            );
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ]);
        } catch (err) {
            console.error("Failed to copy image:", err);
        }
    }

    // Add reset function
    function resetForm() {
        imageFile = null;
        originalImage = null;
        backgroundColor = "#000000";
        originalSize = { width: 0, height: 0 };
        squareSize = "original";
        previewCanvas = null;
    }

    function handleCustomSizeInput(e: Event) {
        const input = e.target as HTMLInputElement;
        const value = parseInt(input.value);
        if (!isNaN(value) && value > 0) {
            customSize = value;
            squareSize = value;
        }
    }
</script>

<div
    class:aspect-square={!!originalImage}
    class:max-w-[600px]={!!originalImage}
    class:p-0={!!originalImage}
    class:border-none={!!originalImage}
    class:rounded-lg={!!originalImage}
    class="max-w-3xl px-4 my-8 mx-auto"
>
    <h1
        class="text-center mb-2 font-semibold text-2xl text-gray-800 dark:text-gray-300"
    >
        Create square images with custom backgrounds
    </h1>
    <p class="text-center text-teal-700 dark:text-teal-400 mb-2">
        Fast and free.
    </p>
    <p class="text-center text-gray-700 dark:text-gray-300 mb-8 text-sm">
        Allows pasting images from clipboard
    </p>

    <div
        class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center cursor-pointer transition-all bg-orange-50 dark:bg-gray-800 min-h-[200px] flex items-center justify-center hover:border-teal-700 dark:hover:border-teal-400 hover:bg-orange-100 dark:hover:bg-gray-700"
        role="region"
        aria-label="Image upload dropzone"
        class:has-image={!!originalImage}
        ondragenter={handleDragEnter}
        ondragleave={handleDragLeave}
        ondragover={handleDragOver}
        ondrop={handleDrop}
    >
        {#if originalImage}
            <canvas
                bind:this={previewCanvas}
                class="w-full h-full object-contain"
            ></canvas>
        {:else}
            <div
                class="flex flex-col items-center gap-4 text-gray-700 dark:text-gray-300"
            >
                <UploadIcon />
                <span>Drag and Drop</span>
                <span>or</span>
                <label
                    class="bg-teal-700 dark:bg-teal-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-all font-medium hover:bg-teal-800 dark:hover:bg-teal-700 hover:-translate-y-0.5"
                >
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        onchange={handleFileSelect}
                        class="hidden"
                    />
                </label>
                <span class="text-gray-700 dark:text-gray-300 text-sm"
                    >or paste from clipboard (Ctrl+V)</span
                >
            </div>
        {/if}
    </div>

    {#if originalImage}
        <div class="text-gray-700 dark:text-gray-300 text-sm text-center mt-2">
            Original: {originalSize.width} × {originalSize.height}
        </div>

        <div class="mt-8 flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <label
                    for="output-size"
                    class="text-teal-700 dark:text-teal-400 text-sm font-medium"
                    >Output Size</label
                >
                <div id="output-size" class="flex gap-2 flex-wrap">
                    {#each sizeOptions as option}
                        <button
                            class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer transition-all bg-orange-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400 {squareSize ===
                            option.value
                                ? 'bg-teal-700 dark:bg-teal-600 border-teal-700 dark:border-teal-600 text-white'
                                : ''}"
                            onclick={() => (squareSize = option.value)}
                        >
                            {option.label}
                        </button>
                    {/each}
                    <div class="relative flex items-center">
                        <input
                            type="number"
                            min="1"
                            step="1"
                            class="w-28 px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-orange-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm transition-all hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400 {typeof squareSize ===
                                'number' &&
                            !sizeOptions.find((opt) => opt.value === squareSize)
                                ? 'bg-teal-700 dark:bg-teal-600 border-teal-700 dark:border-teal-600 text-white'
                                : ''}"
                            value={typeof squareSize === "number"
                                ? squareSize
                                : customSize}
                            oninput={handleCustomSizeInput}
                            placeholder="Custom size"
                        />
                        <span
                            class="absolute right-4 pointer-events-none text-inherit"
                            >px</span
                        >
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label
                    for="background-color"
                    class="text-teal-700 dark:text-teal-400 text-sm font-medium"
                    >Background Color</label
                >
                <div id="background-color" class="flex gap-3 flex-wrap">
                    {#each colorOptions as option}
                        <button
                            aria-label={option.label}
                            class="w-10 h-10 rounded-lg cursor-pointer transition-all border border-gray-300 dark:border-gray-700 hover:-translate-y-0.5 {backgroundColor ===
                            option.value
                                ? 'border-2 border-teal-700 dark:border-teal-400'
                                : ''}"
                            onclick={() => (backgroundColor = option.value)}
                            style:background-color={option.value !==
                            "transparent"
                                ? option.value
                                : undefined}
                            title={option.label}
                        ></button>
                    {/each}
                </div>
            </div>

            <div class="grid grid-cols-[auto_1fr_1fr] gap-4 mt-2">
                <button
                    class="px-6 py-3 rounded-lg cursor-pointer transition-all font-medium bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5"
                    onclick={resetForm}
                >
                    Cancel
                </button>
                <button
                    class="px-3 py-3 rounded-lg cursor-pointer transition-all font-medium bg-teal-700 dark:bg-teal-600 text-white hover:bg-teal-800 dark:hover:bg-teal-700 hover:-translate-y-0.5"
                    onclick={saveImage}
                >
                    Save Image
                </button>
                <button
                    class="px-3 py-3 rounded-lg cursor-pointer transition-all font-medium bg-orange-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 hover:border-teal-700 dark:hover:border-teal-400 hover:text-teal-700 dark:hover:text-teal-400 hover:-translate-y-0.5"
                    onclick={copyImage}
                >
                    Copy Image
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Add checkered pattern for transparent swatch */
    button[title*="Transparent"] {
        position: relative;
        background-color: #ffffff;
    }

    button[title*="Transparent"]::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
            linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
            linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
        background-size: 10px 10px;
        background-position:
            0 0,
            0 5px,
            5px -5px,
            -5px 0;
        border-radius: 0.5rem;
    }

    /* Remove number input spinners */
    input[type="number"] {
        -moz-appearance: textfield;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
