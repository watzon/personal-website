import type { GameState } from '../engine';
import type { FoxEntity } from '../entities/fox';
import { browser } from '$app/environment';

// Keep track of behavior timeout outside the system
let behaviorTimeout: ReturnType<typeof setTimeout> | null = null;

function pickNewBehavior(fox: FoxEntity): FoxEntity['behavior'] {
  const timeSinceInteraction = Date.now() - fox.lastInteractionTime;
  
  // More likely to sleep if inactive for a while
  if (timeSinceInteraction > 30000 && Math.random() < 0.7) {
    return 'sleep';
  }

  const behaviors: Array<[FoxEntity['behavior'], number]> = [
    ['idle', 0.3],
    ['wander', 0.3],
    ['jump', 0.2],
    ['look', 0.2]
  ];

  const total = behaviors.reduce((sum, [_, weight]) => sum + weight, 0);
  let random = Math.random() * total;

  for (const [behavior, weight] of behaviors) {
    random -= weight;
    if (random <= 0) return behavior;
  }

  return 'idle';
}

function startNewBehavior(fox: FoxEntity) {
  if (fox.isFollowingMouse) return;

  if (behaviorTimeout) {
    clearTimeout(behaviorTimeout);
    behaviorTimeout = null;
  }

  const newBehavior = pickNewBehavior(fox);
  fox.behavior = newBehavior;
  fox.targetX = null;
  fox.velocity.x = 0;

  switch (newBehavior) {
    case 'idle':
      fox.state = 'idle';
      behaviorTimeout = setTimeout(() => startNewBehavior(fox), 2000 + Math.random() * 2000);
      break;

    case 'wander':
      if (!browser) break;
      
      const maxX = window.innerWidth - fox.size.x;
      const walkDistance = Math.min(200, maxX / 4);
      const minX = Math.max(0, fox.position.x - walkDistance);
      const maxWalkX = Math.min(maxX, fox.position.x + walkDistance);
      fox.targetX = minX + Math.random() * (maxWalkX - minX);
      
      if (Math.abs(fox.targetX - fox.position.x) > 5) {
        fox.state = 'run';
        fox.facingLeft = fox.targetX < fox.position.x;
      } else {
        fox.behavior = 'idle';
        fox.state = 'idle';
      }
      
      behaviorTimeout = setTimeout(() => startNewBehavior(fox), 3000 + Math.random() * 2000);
      break;

    case 'sleep':
      fox.state = 'sleep';
      behaviorTimeout = setTimeout(() => startNewBehavior(fox), 10000 + Math.random() * 20000);
      break;

    case 'jump':
      fox.state = 'jump';
      fox.velocity.y = -10; // JUMP_FORCE
      fox.isGrounded = false;
      behaviorTimeout = setTimeout(() => startNewBehavior(fox), 1500);
      break;

    case 'look':
      fox.state = 'look';
      behaviorTimeout = setTimeout(() => startNewBehavior(fox), 2000 + Math.random() * 1000);
      break;
  }
}

export function createFoxAISystem() {
  return function foxAISystem(state: GameState) {
    const fox = Array.from(state.entities.values()).find((e): e is FoxEntity => e.type === 'fox');
    if (!fox) return;

    // Handle sploot state naturally
    if (fox.state === 'sploot') {
      const timeSinceInteraction = Date.now() - fox.lastInteractionTime;
      // Randomly decide to exit sploot after some time has passed
      if (timeSinceInteraction > 3000 && Math.random() < 0.1) {
        fox.state = 'idle';
        startNewBehavior(fox);
      }
      return;
    }

    if (!fox.isFollowingMouse && fox.targetX !== null && fox.behavior === 'wander') {
      const diff = fox.targetX - fox.position.x;
      if (Math.abs(diff) > 5) {
        fox.velocity.x = Math.sign(diff) * 3; // MOVE_SPEED
        fox.facingLeft = diff < 0;
      } else {
        fox.targetX = null;
        fox.behavior = 'idle';
        fox.state = 'idle';
      }
    }
  };
}

// Export the behavior management functions
export { startNewBehavior };

// Cleanup function to clear timeouts
export function cleanupFoxAI() {
  if (behaviorTimeout) {
    clearTimeout(behaviorTimeout);
    behaviorTimeout = null;
  }
}
