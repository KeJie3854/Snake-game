export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export function isValidDirectionChange(current: Direction, next: Direction): boolean {
  if (current === 'UP' && next === 'DOWN') return false;
  if (current === 'DOWN' && next === 'UP') return false;
  if (current === 'LEFT' && next === 'RIGHT') return false;
  if (current === 'RIGHT' && next === 'LEFT') return false;
  return true;
}

export function getNextHead(head: Point, dir: Direction): Point {
  switch (dir) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
  }
}

export function isWallCollision(point: Point, gridWidth: number, gridHeight: number): boolean {
  return point.x < 0 || point.x >= gridWidth || point.y < 0 || point.y >= gridHeight;
}

export function isSelfCollision(point: Point, body: Point[]): boolean {
  return body.some(segment => segment.x === point.x && segment.y === point.y);
}

export function spawnFood(
  snake: Point[],
  gridWidth: number,
  gridHeight: number,
  rng: () => number = Math.random
): Point | null {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
  const available: Point[] = [];

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) return null;
  const index = Math.floor(rng() * available.length);
  return available[index];
}

export function calculateSpeed(
  foodEaten: number,
  baseTickMs = 150,
  minTickMs = 65,
  speedUpEvery = 5,
  decreaseMs = 12
): number {
  const levels = Math.floor(foodEaten / speedUpEvery);
  return Math.max(minTickMs, baseTickMs - levels * decreaseMs);
}

export function calculateScore(foodEaten: number, pointsPerFood = 10): number {
  return foodEaten * pointsPerFood;
}
