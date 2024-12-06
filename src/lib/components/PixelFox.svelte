<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { browser } from '$app/environment';
  import spriteImage from '$lib/images/pixel-fox-sprite.png';
  import { page } from '$app/stores';
  
  let container: HTMLButtonElement;
  let currentFrame = $state(0);
  let currentAnimation = $state<'idle' | 'look' | 'run' | 'jump' | 'startled' | 'sleep' | 'sploot'>('idle');
  let isFollowingMouse = $state(false);
  let isMoving = $state(false);
  let facingLeft = $state(false);
  let lastMousePosition = { x: 0, y: 0 };
  let sleepStartTime: number | null = null;
  
  const SPRITE_WIDTH = 32;
  const SPRITE_HEIGHT = 32;
  const SCALE = 5;
  const BOTTOM_MARGIN = 5;
  const LEFT_MARGIN = 5;
  const MOVEMENT_SPEED = 3;
  const WAKE_UP_DISTANCE = 150; // Distance in pixels that will wake up the fox
  const MAX_SLEEP_DURATION = 30000; // Maximum sleep duration (30 seconds)
  
  type AnimationState = {
    frames: number[];
    speed: number;
    row: number;
    loop?: boolean;
  };

  type BehaviorState = 'idle' | 'look' | 'walk' | 'sleep' | 'jump' | 'sploot' | 'startled';

  type StateTransitions = {
    [K in BehaviorState]: {
      next: BehaviorState[];
      weight: number;
      duration: [number, number];
      action: () => void;
      interruptible?: boolean;
    }
  };

  const stateTransitions: StateTransitions = {
    idle: {
      next: ['look', 'walk', 'sleep', 'jump', 'sploot'],
      weight: 20,
      duration: [2000, 4000],
      action: () => {
        targetX = null;
        startAnimation('idle');
      },
      interruptible: true
    },
    look: {
      next: ['idle', 'walk', 'startled'],
      weight: 15,
      duration: [2000, 3000],
      action: () => {
        targetX = null;
        startAnimation('look', 50);
      },
      interruptible: false
    },
    walk: {
      next: ['idle', 'look', 'startled'],
      weight: 25,
      duration: [4000, 8000],
      action: () => {
        const viewportWidth = window.innerWidth;
        const scaledWidth = SPRITE_WIDTH * SCALE;
        const currentLeft = $position.left;
        
        targetX = Math.random() * (viewportWidth - scaledWidth);
        facingLeft = targetX < currentLeft;
        
        startAnimation('run');
      },
      interruptible: true
    },
    startled: {
      next: ['idle', 'walk'],
      weight: 5,
      duration: [1000, 1000],
      action: () => {
        targetX = null;
        startAnimation('startled', 50);
      },
      interruptible: false
    },
    sleep: {
      next: ['idle'],
      weight: 10,
      duration: [15000, MAX_SLEEP_DURATION],
      action: () => {
        targetX = null;
        startAnimation('sleep', 50);
        sleepStartTime = Date.now();
      },
      interruptible: true
    },
    jump: {
      next: ['idle', 'walk'],
      weight: 10,
      duration: [1500, 1500],
      action: () => {
        targetX = null;
        startAnimation('jump', 50);
      },
      interruptible: false
    },
    sploot: {
      next: ['idle'],
      weight: 5,
      duration: [4000, 7000],
      action: () => {
        targetX = null;
        startAnimation('sploot', 50);
      },
      interruptible: false
    }
  };

  const animations: { [K in typeof currentAnimation]: AnimationState } = {
    idle: { frames: [0, 1, 2, 3, 4], speed: 200, row: 0, loop: true },
    look: { frames: Array.from({ length: 14 }, (_, i) => i), speed: 150, row: 1, loop: true },
    run: { frames: Array.from({ length: 8 }, (_, i) => i), speed: 100, row: 2, loop: true },
    jump: { frames: Array.from({ length: 11 }, (_, i) => i), speed: 150, row: 3, loop: false },
    startled: { frames: Array.from({ length: 5 }, (_, i) => i), speed: 150, row: 4, loop: false },
    sleep: { frames: Array.from({ length: 6 }, (_, i) => i), speed: 300, row: 5, loop: true },
    sploot: { frames: Array.from({ length: 7 }, (_, i) => i), speed: 200, row: 6, loop: false }
  };

  const position = spring<{ left: number; bottom: number }>(
    { left: LEFT_MARGIN, bottom: BOTTOM_MARGIN },
    { stiffness: 0.1, damping: 0.4 }
  );

  let animationInterval: ReturnType<typeof setInterval> | undefined;
  let lastMouseMove = Date.now();
  let idleTimeout: ReturnType<typeof setTimeout> | undefined;
  let aiInterval: ReturnType<typeof setInterval> | undefined;
  let currentBehavior: BehaviorState = 'idle';
  let targetX: number | null = null;
  let pendingAnimationTimeout: ReturnType<typeof setTimeout> | undefined;

  // Element interaction constants
  const INTERACTION_DISTANCE = 100; // Distance to detect elements
  const TEXT_READ_DURATION = 3000; // How long to "read" text
  const BORDER_FOLLOW_DURATION = 5000; // How long to follow borders
  const FALL_SPEED = 10; // Pixels per frame when falling
  const MAX_FALL_DISTANCE = 1000; // Maximum pixels to fall before stopping
  
  type InteractiveElement = {
    element: Element;
    type: 'text' | 'border' | 'background';
    rect: DOMRect;
  };

  let currentInteraction: InteractiveElement | null = null;
  let interactionTimeout: ReturnType<typeof setTimeout> | undefined;
  let isFalling = false;
  let fallInterval: ReturnType<typeof setInterval> | undefined;

  function findNearbyElements(x: number, y: number): InteractiveElement[] {
    if (!browser) return [];
    
    // Get all visible elements
    const elements = document.elementsFromPoint(x, y);
    
    return elements
      .map(element => {
        const styles = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        // Skip if element is too small or invisible
        if (rect.width < 20 || rect.height < 20 || styles.display === 'none') return null;
        
        // Determine element type
        if (styles.border && styles.border !== 'none') {
          return { element, type: 'border', rect } as InteractiveElement;
        }
        if (element.textContent && element.textContent.trim().length > 10) {
          return { element, type: 'text', rect } as InteractiveElement;
        }
        if (styles.backgroundColor && styles.backgroundColor !== 'transparent') {
          return { element, type: 'background', rect } as InteractiveElement;
        }
        return null;
      })
      .filter((e): e is InteractiveElement => e !== null);
  }

  function findElementBelow(x: number, y: number): InteractiveElement | null {
    if (!browser) return null;
    
    // Cast a ray down from the current position to find landing spots
    const rayPoints = Array.from({ length: 20 }, (_, i) => y + i * 50);
    let bestElement: InteractiveElement | null = null;
    let closestDistance = Infinity;
    
    console.log('Checking for elements at x:', x, 'starting from y:', y);
    
    // Check multiple points below the fox
    for (const checkY of rayPoints) {
      const elements = Array.from(document.elementsFromPoint(x, checkY));
      console.log('Found elements at y:', checkY, 'count:', elements.length);
      
      for (const element of elements) {
        // Skip the fox itself and its container
        if (element === container || element.contains(container)) continue;
        
        const styles = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        // Skip if element is too small or invisible
        if (rect.width < 20 || rect.height < 20 || styles.display === 'none') {
          console.log('Skipping element:', element, 'due to size/visibility');
          continue;
        }
        
        // Calculate distance from current position to top of element
        const distance = Math.max(0, rect.top - y);
        console.log('Element:', element, 'distance:', distance);
        
        // Only consider elements below us
        if (distance <= 0) continue;
        
        if (distance < closestDistance) {
          // Determine element type
          let type: InteractiveElement['type'] | null = null;
          
          // Check for specific element types
          if (element instanceof HTMLButtonElement || 
              element instanceof HTMLAnchorElement ||
              styles.cursor === 'pointer') {
            type = 'background'; // Treat interactive elements as background
          } else if (styles.border && styles.border !== 'none' && styles.border !== '0px none rgb(0, 0, 0)') {
            type = 'border';
          } else if (element.textContent && element.textContent.trim().length > 10) {
            type = 'text';
          } else if (styles.backgroundColor && 
                    styles.backgroundColor !== 'transparent' && 
                    styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            type = 'background';
          }
          
          if (type) {
            console.log('Found valid element:', element, 'of type:', type, 'at distance:', distance);
            bestElement = { element, type, rect };
            closestDistance = distance;
          }
        }
      }
      
      // If we found a valid element, no need to check further down
      if (bestElement) break;
    }
    
    console.log('Best element found:', bestElement);
    return bestElement;
  }

  function startElementInteraction(element: InteractiveElement) {
    if (interactionTimeout) clearTimeout(interactionTimeout);
    currentInteraction = element;
    
    switch (element.type) {
      case 'text':
        // Move to start of text and "read" it
        targetX = element.rect.left + LEFT_MARGIN;
        currentAnimation = 'look';
        interactionTimeout = setTimeout(() => {
          currentInteraction = null;
          executeBehavior();
        }, TEXT_READ_DURATION);
        break;
        
      case 'border':
        // Follow along the border
        const borderPoints = [
          element.rect.left + LEFT_MARGIN,
          element.rect.right - SPRITE_WIDTH * SCALE - LEFT_MARGIN
        ];
        targetX = facingLeft ? borderPoints[0] : borderPoints[1];
        currentAnimation = 'run';
        interactionTimeout = setTimeout(() => {
          currentInteraction = null;
          executeBehavior();
        }, BORDER_FOLLOW_DURATION);
        break;
        
      case 'background':
        // Jump or sploot on the element
        targetX = element.rect.left + element.rect.width / 2;
        currentAnimation = Math.random() > 0.5 ? 'jump' : 'sploot';
        interactionTimeout = setTimeout(() => {
          currentInteraction = null;
          executeBehavior();
        }, 2000);
        break;
    }
  }

  function clearAllTimers() {
    if (animationInterval) clearInterval(animationInterval);
    if (idleTimeout) clearTimeout(idleTimeout);
    if (pendingAnimationTimeout) clearTimeout(pendingAnimationTimeout);
    if (interactionTimeout) clearTimeout(interactionTimeout);
    if (fallInterval) clearInterval(fallInterval);
    animationInterval = undefined;
    idleTimeout = undefined;
    pendingAnimationTimeout = undefined;
    interactionTimeout = undefined;
    fallInterval = undefined;
  }

  function startFalling() {
    if (fallInterval) clearInterval(fallInterval);
    isFalling = true;
    currentAnimation = 'jump';
    let fallDistance = 0;
    let startY = window.innerHeight - $position.bottom;
    
    console.log('Starting fall from y:', startY);
    
    fallInterval = setInterval(() => {
      if (!isFalling || fallDistance > MAX_FALL_DISTANCE) {
        console.log('Stopping fall due to:', !isFalling ? 'not falling' : 'max distance');
        clearInterval(fallInterval);
        isFalling = false;
        executeBehavior();
        return;
      }
      
      const currentPos = $position;
      const nextY = currentPos.bottom - FALL_SPEED;
      fallDistance += FALL_SPEED;
      
      // Get screen coordinates for element detection
      const screenX = currentPos.left + (SPRITE_WIDTH * SCALE) / 2;
      const screenY = window.innerHeight - nextY;
      
      console.log('Falling to y:', screenY, 'fall distance:', fallDistance);
      
      // Check for elements below
      const element = findElementBelow(screenX, screenY);
      
      if (element) {
        console.log('Landing on element:', element);
        // Land on the element
        clearInterval(fallInterval);
        isFalling = false;
        // Land slightly above the element's top edge
        const landingY = window.innerHeight - element.rect.top + BOTTOM_MARGIN;
        position.set({ ...currentPos, bottom: landingY });
        startElementInteraction(element);
      } else {
        // Continue falling
        position.set({ ...currentPos, bottom: nextY });
      }
    }, 16); // ~60fps
  }

  // Subscribe to page changes to wake up the fox
  $effect(() => {
    const currentPath = $page.url.pathname;
    if (currentAnimation === 'sleep') {
      wakeUp();
    }
  });

  function wakeUp() {
    if (currentAnimation === 'sleep') {
      currentAnimation = 'idle';
      sleepStartTime = null;
      startAnimation('idle');
      // Force next behavior selection
      setTimeout(executeBehavior, 1000);
      currentInteraction = null;
      if (interactionTimeout) clearTimeout(interactionTimeout);
    }
  }

  function checkForWakeUp(mouseX: number, mouseY: number) {
    if (currentAnimation !== 'sleep' || !sleepStartTime) return;

    const foxPosition = {
      x: $position.left + (SPRITE_WIDTH * SCALE) / 2,
      y: window.innerHeight - $position.bottom - (SPRITE_HEIGHT * SCALE) / 2
    };

    const distance = Math.hypot(mouseX - foxPosition.x, mouseY - foxPosition.y);

    // Wake up if mouse is too close or we've been sleeping too long
    if (distance < WAKE_UP_DISTANCE || Date.now() - sleepStartTime > MAX_SLEEP_DURATION) {
      wakeUp();
    }
  }

  function pickNextBehavior(currentState: BehaviorState): BehaviorState {
    const validTransitions = stateTransitions[currentState].next;
    const availableStates = validTransitions.map(state => ({
      state,
      weight: stateTransitions[state].weight
    }));
    
    const totalWeight = availableStates.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const {state, weight} of availableStates) {
      random -= weight;
      if (random <= 0) return state;
    }
    
    return 'idle';
  }

  function executeBehavior() {
    if (isFollowingMouse) return;
    
    const nextState = pickNextBehavior(currentBehavior as BehaviorState);
    const transition = stateTransitions[nextState];
    
    currentBehavior = nextState;
    transition.action();
    
    const [minDuration, maxDuration] = transition.duration;
    const duration = Math.random() * (maxDuration - minDuration) + minDuration;
    
    setTimeout(executeBehavior, duration);
  }

  function startAI() {
    if (aiInterval) return;
    
    function executeBehavior() {
      if (isFollowingMouse) return;
      
      const nextState = pickNextBehavior(currentBehavior as BehaviorState);
      const transition = stateTransitions[nextState];
      
      currentBehavior = nextState;
      transition.action();
      
      const [minDuration, maxDuration] = transition.duration;
      const duration = Math.random() * (maxDuration - minDuration) + minDuration;
      
      setTimeout(executeBehavior, duration);
    }
    
    executeBehavior();
  }

  function stopAI() {
    if (aiInterval) {
      clearInterval(aiInterval);
      aiInterval = undefined;
    }
    targetX = null;
    clearAllTimers();
  }

  function updateSprite() {
    const sprite = container?.style;
    if (!sprite) return;
    
    const animation = animations[currentAnimation];
    const frameIndex = animation.frames[currentFrame % animation.frames.length];
    const x = frameIndex * SPRITE_WIDTH;
    const y = animation.row * SPRITE_HEIGHT;
    
    sprite.backgroundPosition = `-${x}px -${y}px`;

    // If animation doesn't loop and we're at the end, go back to idle
    if (!animation.loop && currentFrame >= animation.frames.length - 1) {
      targetX = null;  // Stop any movement when animation ends
      currentAnimation = 'idle';
      currentFrame = 0;
      startAnimation('idle');
    }
  }

  function updatePosition() {
    if (!browser || isFollowingMouse || targetX === null) return;
    
    const currentLeft = $position.left;
    const distance = targetX - currentLeft;
    
    if (Math.abs(distance) < MOVEMENT_SPEED) {
      position.set({ ...$position, left: targetX });
      targetX = null;
      // Stop movement before changing animation
      setTimeout(() => {
        currentAnimation = 'idle';
        startAnimation('idle');
      }, 50);
      return;
    }
    
    const direction = distance > 0 ? 1 : -1;
    facingLeft = direction < 0;
    
    position.set({
      ...$position,
      left: currentLeft + (MOVEMENT_SPEED * direction)
    });
  }

  function startAnimation(newAnimation: typeof currentAnimation, delay = 0) {
    if (!browser) return;
    
    clearAllTimers();
    
    const startNewAnimation = () => {
      currentAnimation = newAnimation;
      currentFrame = 0; // Reset frame counter for new animation
      animationInterval = setInterval(() => {
        currentFrame++;
        updateSprite();
      }, animations[newAnimation].speed);
    };
    
    if (delay) {
      pendingAnimationTimeout = setTimeout(startNewAnimation, delay);
    } else {
      startNewAnimation();
    }
  }

  function stopAnimation() {
    clearAllTimers();
  }

  function handleMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    
    // Check for wake up before handling mouse following
    checkForWakeUp(clientX, clientY);
    
    if (!isFollowingMouse && !currentInteraction && Math.random() < 0.1) {
      const nearbyElements = findNearbyElements(clientX, clientY);
      const interactiveElement = nearbyElements[Math.floor(Math.random() * nearbyElements.length)];
      if (interactiveElement) {
        startElementInteraction(interactiveElement);
      }
    }

    if (!isFollowingMouse) {
      // Store mouse position even when not following
      lastMousePosition = { x: clientX, y: clientY };
      return;
    }

    const now = Date.now();
    const scaledWidth = SPRITE_WIDTH * SCALE;
    const scaledHeight = SPRITE_HEIGHT * SCALE;
    
    const left = Math.max(0, Math.min(clientX - scaledWidth/2, window.innerWidth - scaledWidth));
    const bottom = Math.max(0, Math.min(
      window.innerHeight - clientY - scaledHeight/2, 
      window.innerHeight - scaledHeight
    ));
    
    facingLeft = clientX < $position.left;
    position.set({ left, bottom });
    isMoving = true;

    if (now - lastMouseMove > 100) {
      const distance = Math.hypot(
        event.movementX,
        event.movementY
      );
      
      if (distance > 10) {
        currentAnimation = 'run';
      } else {
        currentAnimation = 'look';
      }
      startAnimation(currentAnimation);
      lastMouseMove = now;
    }

    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      if (isFollowingMouse) {
        currentAnimation = 'look';
        startAnimation('look');
      }
    }, 500);
  }

  function handleInteraction() {
    if (isFalling) return; // Prevent interaction while falling
    
    if (isFollowingMouse) {
      // When releasing the fox, start falling
      isFollowingMouse = false;
      isMoving = false;
      console.log('Starting fall from mouse release');
      startFalling();
    } else {
      isFollowingMouse = true;
      currentInteraction = null;
      if (interactionTimeout) clearTimeout(interactionTimeout);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleInteraction();
    } else if (event.key === 's' && !isFollowingMouse) {
      currentAnimation = 'sleep';
      startAnimation('sleep');
    } else if (event.key === 'j' && !isFollowingMouse) {
      currentAnimation = 'jump';
      startAnimation('jump');
    } else if (event.key === 'x' && !isFollowingMouse) {
      currentAnimation = 'sploot';
      startAnimation('sploot');
    }
  }

  onMount(() => {
    if (!browser) return;
    position.set({ left: LEFT_MARGIN, bottom: BOTTOM_MARGIN });
    
    currentAnimation = 'idle';
    startAnimation('idle');
    startAI();
    window.addEventListener('mousemove', handleMouseMove);

    // Start the position update loop
    aiInterval = setInterval(updatePosition, 16); // ~60fps
  });

  onDestroy(() => {
    if (!browser) return;
    
    stopAnimation();
    stopAI();
    window.removeEventListener('mousemove', handleMouseMove);
    clearAllTimers();
  });

  $effect(() => {
    if (!browser || !position || !container) return;
    
    const pos = $position;
    container.style.left = `${pos.left}px`;
    container.style.bottom = `${pos.bottom}px`;
    container.style.transform = `scale(${SCALE}) rotateY(${facingLeft ? '180deg' : '0deg'})`;
  });
</script>

<button
  bind:this={container}
  class="pixel-fox"
  class:moving={isMoving}
  type="button"
  style="background-image: url({spriteImage});"
  onclick={handleInteraction}
  onkeydown={handleKeyDown}
  aria-label="Interactive pixel fox pet. Click to make the fox follow your cursor. Press S to sleep, J to jump, and X to sploot."
>
</button>

<style>
  .pixel-fox {
    position: fixed;
    width: 32px;
    height: 32px;
    background-repeat: no-repeat;
    image-rendering: pixelated;
    cursor: pointer;
    z-index: 1000;
    transition: left 0.3s ease, bottom 0.3s ease, transform 0.15s ease;
    padding: 0;
    border: none;
    background-color: transparent;
    transform-origin: center bottom;
    transform-style: preserve-3d;
    perspective: 1000px;
    will-change: transform;
  }

  .pixel-fox.moving {
    transition: left 0.1s linear, bottom 0.1s linear, transform 0.15s ease;
  }

  .pixel-fox:hover {
    filter: brightness(1.2);
  }

  .pixel-fox:focus {
    outline: none;
    filter: brightness(1.2);
  }

  .pixel-fox:focus-visible {
    outline: 2px solid #646cff;
    outline-offset: 2px;
    border-radius: 4px;
  }
</style>
