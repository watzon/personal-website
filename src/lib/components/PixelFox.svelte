<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import spriteImage from '$lib/images/pixel-fox-sprite.png';
  import { gameEngine } from '$lib/game/engine';
  import { createFox, type FoxEntity, animations, type FoxState } from '$lib/game/entities/fox';
  import { createFoxAISystem, cleanupFoxAI, startNewBehavior } from '$lib/game/systems/foxAI';

  let container: HTMLButtonElement;
  let fox: FoxEntity | undefined = $state(undefined);
  let currentFrame = $state(0);
  let animationTimer = $state(0);
  let mouseTarget = { x: 0, y: 0 };
  let keys = new Set<string>();
  let previousState = $state<FoxState>('idle');
  let isTransitioning = $state(false);

  function handleKeyDown(e: KeyboardEvent) {
    keys.add(e.key.toLowerCase());
    updateLastInteraction();
  }

  function handleKeyUp(e: KeyboardEvent) {
    keys.delete(e.key.toLowerCase());
  }

  function handleMouseMove(e: MouseEvent) {
    if (fox?.isFollowingMouse) {
      mouseTarget = { 
        x: e.clientX - fox.size.x / 2,
        y: fox.position.y
      };
    }
  }

  function updateLastInteraction() {
    if (!fox) return;
    fox.lastInteractionTime = Date.now();
    if (fox.state === 'sleep') {
      startNewBehavior(fox);
    }
  }

  function toggleMouseFollow() {
    if (!fox) return;
    fox.isFollowingMouse = !fox.isFollowingMouse;
    updateLastInteraction();
    
    if (fox.isFollowingMouse) {
      fox.state = 'startled';
      fox.behavior = 'idle';
      setTimeout(() => {
        if (!fox) return;
        if (fox.isFollowingMouse) {
          fox.behavior = 'idle';
        }
      }, animations.startled.frames.length * animations.startled.speed);
    } else {
      startNewBehavior(fox);
    }
  }

  // Animation system
  function createAnimationSystem() {
    return function animationSystem() {
      if (!fox) return;

      const currentAnim = animations[fox.state];
      animationTimer += gameEngine.gameState.deltaTime;
      
      // Handle state transitions
      if (previousState !== fox.state) {
        isTransitioning = true;
        setTimeout(() => {
          if (!fox) return;
          previousState = fox.state;
          isTransitioning = false;
        }, 150); // Match the transition duration
      }

      while (animationTimer >= currentAnim.speed) {
        animationTimer -= currentAnim.speed;
        if (currentFrame < currentAnim.frames.length - 1) {
          currentFrame++;
        } else if (currentAnim.loop) {
          currentFrame = 0;
        } else if (fox.state !== 'sploot') {
          fox.state = 'idle';
          currentFrame = 0;
        } else {
          currentFrame = currentAnim.frames.length - 1;
        }
      }
    };
  }

  // Movement system
  function createMovementSystem() {
    return function movementSystem() {
      if (!fox || !browser) return;

      if (fox.isFollowingMouse && fox.state !== 'startled') {
        const diff = mouseTarget.x - fox.position.x;
        if (Math.abs(diff) > 5) {
          fox.velocity.x = Math.sign(diff) * 3;
          fox.facingLeft = diff < 0;
          fox.state = 'run';
        } else {
          fox.velocity.x = 0;
          fox.state = 'idle';
        }
      } else if (!fox.isFollowingMouse) {
        let isMoving = false;

        // Check if any movement keys are pressed
        const isAnyMovementKey = keys.has('arrowleft') || keys.has('a') || 
                                keys.has('arrowright') || keys.has('d') ||
                                keys.has('arrowup') || keys.has('w') || 
                                keys.has(' ');

        // Handle sploot initiation
        if ((keys.has('arrowdown') || keys.has('s')) && fox.isGrounded && fox.state !== 'sploot') {
          fox.state = 'sploot';
          currentFrame = 0;
          updateLastInteraction();
          return; // Don't process other movements when initiating sploot
        }

        // If we're splooting and movement keys are pressed, interrupt it
        if (fox.state === 'sploot' && isAnyMovementKey) {
          fox.state = 'idle';
        }

        // Don't process movement if we're in sploot animation
        if (fox.state === 'sploot') {
          fox.velocity.x = 0;
          return;
        }

        if (keys.has('arrowleft') || keys.has('a')) {
          fox.velocity.x = -3;
          fox.facingLeft = true;
          isMoving = true;
          updateLastInteraction();
        } else if (keys.has('arrowright') || keys.has('d')) {
          fox.velocity.x = 3;
          fox.facingLeft = false;
          isMoving = true;
          updateLastInteraction();
        } else {
          fox.velocity.x = 0;
        }

        if ((keys.has('arrowup') || keys.has('w') || keys.has(' ')) && fox.isGrounded) {
          fox.velocity.y = -10;
          fox.isGrounded = false;
          fox.state = 'jump';
          currentFrame = 0;
          updateLastInteraction();
        } else if (!fox.isGrounded) {
          // Only transition to fall if jump animation is complete
          const jumpAnim = animations['jump'];
          if (fox.state !== 'jump' || (fox.state === 'jump' && currentFrame >= jumpAnim.frames.length - 1)) {
            fox.state = fox.velocity.y < 0 ? 'jump' : 'fall';
          }
        } else if (isMoving) {
          fox.state = 'run';
        } else if (fox.state === 'run' || fox.state === 'fall') {
          fox.state = 'idle';
        }
      }
    };
  }

  onMount(() => {
    if (browser) {
      // Create and add fox entity
      fox = createFox();
      gameEngine.addEntity(fox);

      // Add systems
      gameEngine.addSystem(createAnimationSystem());
      gameEngine.addSystem(createMovementSystem());
      gameEngine.addSystem(createFoxAISystem());

      // Start the game engine
      gameEngine.start();

      // Add event listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('mousemove', handleMouseMove);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      gameEngine.removeEntity('fox');
      cleanupFoxAI();
    }
  });
</script>

<button
  class="container"
  bind:this={container}
  onclick={toggleMouseFollow}
  onmousemove={handleMouseMove}
  style="
    left: {fox?.position.x ?? 0}px;
    width: {fox?.size.x ?? 160}px;
    height: {fox?.size.y ?? 160}px;
    z-index: {fox?.zIndex ?? 1000};
  "
>
  {#if isTransitioning}
    <div
      class="sprite previous"
      class:facing-left={fox?.facingLeft}
      style="
        background-image: url({spriteImage});
        background-position: -{currentFrame * 32 * 5}px -{animations[previousState].row * 32 * 5}px;
        background-size: {32 * 5 * 14}px {32 * 5 * 7}px;
        opacity: 0;
      "
    ></div>
  {/if}
  <div
    class="sprite current"
    class:facing-left={fox?.facingLeft}
    style="
      background-image: url({spriteImage});
      background-position: -{currentFrame * 32 * 5}px -{animations[fox?.state ?? 'idle'].row * 32 * 5}px;
      background-size: {32 * 5 * 14}px {32 * 5 * 7}px;
    "
  ></div>
</button>

<style>
  .container {
    position: fixed;
    bottom: 0;
    border: none;
    padding: 0;
    cursor: pointer;
    transform-style: preserve-3d;
    perspective: 1000px;
    background: none;
  }

  .sprite {
    position: absolute;
    inset: 0;
    image-rendering: pixelated;
    transform-origin: center center;
    backface-visibility: visible;
    will-change: transform, opacity;
    pointer-events: none;
  }

  .sprite.current {
    transition: transform 150ms ease-out;
  }

  .sprite.previous {
    transition: transform 150ms ease-out, opacity 150ms ease-out;
  }

  .sprite.facing-left {
    transform: rotateY(180deg);
  }

  :global(body.dark) .sprite {
    filter: brightness(0.8);
  }
</style>
