import type { Entity, Vec2 } from '../engine';
import { browser } from '$app/environment';

export type FoxState = 'idle' | 'run' | 'jump' | 'fall' | 'startled' | 'sleep' | 'look' | 'sploot';
export type FoxBehavior = 'idle' | 'wander' | 'sleep' | 'jump' | 'look';

export interface FoxEntity extends Entity {
  type: 'fox';
  state: FoxState;
  behavior: FoxBehavior;
  isFollowingMouse: boolean;
  targetX: number | null;
  lastInteractionTime: number;
}

export const animations = {
  idle: { frames: [0, 1, 2, 3, 4], speed: 250, row: 0, loop: true },
  look: { frames: Array.from({ length: 14 }, (_, i) => i), speed: 200, row: 1, loop: true },
  run: { frames: Array.from({ length: 8 }, (_, i) => i), speed: 80, row: 2, loop: true },
  jump: { frames: Array.from({ length: 11 }, (_, i) => i), speed: 100, row: 3, loop: false },
  fall: { frames: [5, 6, 7], speed: 100, row: 3, loop: true },
  startled: { frames: Array.from({ length: 5 }, (_, i) => i), speed: 50, row: 4, loop: false },
  sleep: { frames: Array.from({ length: 6 }, (_, i) => i), speed: 250, row: 5, loop: true },
  sploot: { frames: Array.from({ length: 7 }, (_, i) => i), speed: 150, row: 6, loop: false }
};

export function createFox(): FoxEntity {
  const size: Vec2 = { x: 32 * 5, y: 32 * 5 }; // SCALE = 5
  let initialX = 0;

  if (browser) {
    const maxX = window.innerWidth - size.x;
    initialX = Math.floor(Math.random() * maxX);
  }

  return {
    id: 'fox',
    type: 'fox',
    position: { x: initialX, y: 0 },
    velocity: { x: 0, y: 0 },
    size,
    state: 'idle',
    behavior: 'idle',
    facingLeft: false,
    isGrounded: true,
    isFollowingMouse: false,
    targetX: null,
    lastInteractionTime: Date.now(),
    zIndex: 1000,
    currentFrame: 0,
    animationTimer: 0
  };
}
