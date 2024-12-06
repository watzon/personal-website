import { browser } from '$app/environment';

export type Vec2 = {
  x: number;
  y: number;
};

export type Entity = {
  id: string;
  position: Vec2;
  velocity: Vec2;
  size: Vec2;
  type: string;
  state: string;
  facingLeft: boolean;
  isGrounded?: boolean;
  zIndex?: number;
  [key: string]: any; // Allow for custom properties
};

export type GameState = {
  entities: Map<string, Entity>;
  lastTime: number;
  deltaTime: number;
  isPaused: boolean;
};

export class GameEngine {
  private state: GameState = {
    entities: new Map(),
    lastTime: 0,
    deltaTime: 0,
    isPaused: false
  };

  private systems: Array<(state: GameState) => void> = [];
  private gameLoop: number | null = null;

  constructor() {
    this.addSystem(this.physicsSystem.bind(this));
  }

  // Getter for game state
  get gameState(): GameState {
    return this.state;
  }

  addEntity(entity: Entity) {
    this.state.entities.set(entity.id, entity);
  }

  removeEntity(id: string) {
    this.state.entities.delete(id);
  }

  getEntity(id: string): Entity | undefined {
    return this.state.entities.get(id);
  }

  addSystem(system: (state: GameState) => void) {
    this.systems.push(system);
  }

  private physicsSystem(state: GameState) {
    if (!browser) return;

    const gravity = 0.5;
    const groundY = window.innerHeight - 32 * 5; // Default ground level

    for (const entity of state.entities.values()) {
      if (entity.velocity) {
        // Apply gravity if not grounded
        if (!entity.isGrounded) {
          entity.velocity.y += gravity;
        }

        // Update position
        entity.position.x += entity.velocity.x;
        entity.position.y += entity.velocity.y;

        // Screen boundaries
        const maxX = window.innerWidth - entity.size.x;
        entity.position.x = Math.max(0, Math.min(entity.position.x, maxX));

        // Ground collision
        if (entity.position.y >= groundY) {
          entity.position.y = groundY;
          entity.velocity.y = 0;
          entity.isGrounded = true;
        }
      }
    }
  }

  start() {
    if (this.gameLoop !== null) return;

    const update = (timestamp: number) => {
      if (this.state.lastTime === 0) {
        this.state.lastTime = timestamp;
      }

      this.state.deltaTime = timestamp - this.state.lastTime;
      this.state.lastTime = timestamp;

      if (!this.state.isPaused) {
        for (const system of this.systems) {
          system(this.state);
        }
      }

      this.gameLoop = requestAnimationFrame(update);
    };

    this.gameLoop = requestAnimationFrame(update);
  }

  stop() {
    if (this.gameLoop !== null) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  pause() {
    this.state.isPaused = true;
  }

  resume() {
    this.state.isPaused = false;
  }
}

// Create a singleton instance
export const gameEngine = new GameEngine();
