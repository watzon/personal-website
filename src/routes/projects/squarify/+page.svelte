<script lang="ts">
    import { onMount } from "svelte";

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

<div class="container">
    <h1>Create square images with custom backgrounds</h1>
    <p class="subtitle">Fast and free.</p>
    <p class="paste-hint">Allows pasting images from clipboard</p>

    <div
        class="upload-zone"
        role="region"
        aria-label="Image upload dropzone"
        class:active={dragActive}
        class:has-image={!!originalImage}
        ondragenter={handleDragEnter}
        ondragleave={handleDragLeave}
        ondragover={handleDragOver}
        ondrop={handleDrop}
    >
        {#if originalImage}
            <canvas bind:this={previewCanvas} class="preview-canvas"></canvas>
        {:else}
            <div class="upload-content">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>Drag and Drop</span>
                <span>or</span>
                <label class="upload-button">
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        onchange={handleFileSelect}
                    />
                </label>
                <span class="paste-text">or paste from clipboard (Ctrl+V)</span>
            </div>
        {/if}
    </div>

    {#if originalImage}
        <div class="controls">
            <div class="size-info">
                <div>
                    Original: {originalSize.width} × {originalSize.height}
                </div>
            </div>

            <div class="control-group">
                <label>Output Size</label>
                <div class="size-options">
                    {#each sizeOptions as option}
                        <button
                            class:active={squareSize === option.value}
                            onclick={() => (squareSize = option.value)}
                        >
                            {option.label}
                        </button>
                    {/each}
                    <div class="custom-size">
                        <input
                            type="number"
                            min="1"
                            step="1"
                            class="custom-size-input"
                            class:active={typeof squareSize === "number" &&
                                !sizeOptions.find(
                                    (opt) => opt.value === squareSize,
                                )}
                            value={typeof squareSize === "number"
                                ? squareSize
                                : customSize}
                            oninput={handleCustomSizeInput}
                            placeholder="Custom size"
                        />
                        <span class="unit">px</span>
                    </div>
                </div>
            </div>

            <div class="control-group">
                <label for="background-color">Background Color</label>
                <div id="background-color" class="color-options">
                    {#each colorOptions as option}
                        <button
                            aria-label={option.label}
                            class="color-swatch"
                            class:active={backgroundColor === option.value}
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

            <div class="button-group">
                <button class="cancel-button" onclick={resetForm}>
                    Cancel
                </button>
                <button class="save-button" onclick={saveImage}>
                    Save Image
                </button>
                <button class="copy-button" onclick={copyImage}>
                    Copy Image
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    h1 {
        text-align: center;
        margin-bottom: 0.5rem;
        font-weight: 600;
        font-size: 2rem;
        color: #fff;
    }

    .subtitle {
        text-align: center;
        color: #5eead4;
        margin-bottom: 0.5rem;
    }

    .paste-hint {
        text-align: center;
        color: #94a3b8;
        margin-bottom: 2rem;
        font-size: 0.875rem;
    }

    .upload-zone {
        border: 2px dashed #334155;
        border-radius: 1rem;
        padding: 2rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
        background: #0f172a;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .upload-zone.active {
        border-color: #5eead4;
        background: #1e293b;
    }

    .upload-zone.has-image {
        padding: 0;
        aspect-ratio: 1;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        border: none;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .upload-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        color: #94a3b8;
    }

    .preview-canvas {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    input[type="file"] {
        display: none;
    }

    .upload-button {
        background: #14b8a6;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
    }

    .upload-button:hover {
        background: #0d9488;
        transform: translateY(-1px);
    }

    .paste-text {
        color: #94a3b8;
        font-size: 0.875rem;
    }

    .controls {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .control-group label {
        color: #5eead4;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .size-info {
        color: #94a3b8;
        font-size: 0.875rem;
    }

    .size-options {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .size-options button {
        padding: 0.5rem 1rem;
        border: 1px solid #334155;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        background: #0f172a;
        color: #94a3b8;
        font-size: 0.875rem;
    }

    .size-options button:hover {
        border-color: #5eead4;
        color: #5eead4;
    }

    .size-options button.active {
        background: #14b8a6;
        border-color: #14b8a6;
        color: white;
    }

    .color-options {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .color-swatch {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid #334155;
        position: relative;
        box-sizing: border-box;
    }

    /* Add checkered pattern for transparent swatch */
    .color-swatch[title=""],
    .color-swatch[title*="Transparent"] {
        position: relative;
        background-color: #ffffff;
    }

    .color-swatch[title=""]::before,
    .color-swatch[title*="Transparent"]::before {
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

    .color-swatch:hover {
        transform: translateY(-1px);
    }

    .color-swatch.active {
        border: 2px solid #5eead4;
    }

    .button-group {
        display: grid;
        grid-template-columns: auto 1fr 1fr;
        gap: 1rem;
        margin-top: 0.5rem;
    }

    .save-button,
    .copy-button,
    .cancel-button {
        padding: 0.75rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
        color: white;
    }

    .cancel-button {
        background: #dc2626;
        padding: 0.75rem 1.5rem;
    }

    .cancel-button:hover {
        background: #b91c1c;
        transform: translateY(-1px);
    }

    .save-button {
        background: #14b8a6;
    }

    .save-button:hover {
        background: #0d9488;
        transform: translateY(-1px);
    }

    .copy-button {
        background: #0f172a;
        border: 1px solid #334155;
    }

    .copy-button:hover {
        border-color: #5eead4;
        color: #5eead4;
        transform: translateY(-1px);
    }

    .save-button,
    .copy-button {
        flex: 1;
    }

    .custom-size {
        position: relative;
        display: flex;
        align-items: center;
    }

    .custom-size-input {
        width: 7rem;
        padding: 0.5rem 2.5rem 0.5rem 1rem;
        border: 1px solid #334155;
        border-radius: 0.5rem;
        background: #0f172a;
        color: #94a3b8;
        font-size: 0.875rem;
        transition: all 0.2s;
    }

    .custom-size-input:hover {
        border-color: #5eead4;
        color: #5eead4;
    }

    .custom-size-input.active {
        background: #14b8a6;
        border-color: #14b8a6;
        color: white;
    }

    .custom-size-input::-webkit-inner-spin-button,
    .custom-size-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .custom-size-input[type="number"] {
        -moz-appearance: textfield;
    }

    .custom-size .unit {
        position: absolute;
        right: 1rem;
        color: inherit;
        pointer-events: none;
    }
</style>
