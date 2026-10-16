import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidDirectionChange,
  getNextHead,
  isWallCollision,
  isSelfCollision,
  spawnFood,
  calculateSpeed,
  calculateScore
} from './rules.ts';

test('direction change validation prevents 180-degree immediate reversal', () => {
  assert.equal(isValidDirectionChange('UP', 'DOWN'), false);
  assert.equal(isValidDirectionChange('DOWN', 'UP'), false);
  assert.equal(isValidDirectionChange('LEFT', 'RIGHT'), false);
  assert.equal(isValidDirectionChange('RIGHT', 'LEFT'), false);

  assert.equal(isValidDirectionChange('UP', 'LEFT'), true);
  assert.equal(isValidDirectionChange('UP', 'RIGHT'), true);
  assert.equal(isValidDirectionChange('LEFT', 'UP'), true);
  assert.equal(isValidDirectionChange('RIGHT', 'DOWN'), true);
});

test('getNextHead calculates next tile coordinates based on direction', () => {
  const head = { x: 10, y: 10 };
  assert.deepEqual(getNextHead(head, 'UP'), { x: 10, y: 9 });
  assert.deepEqual(getNextHead(head, 'DOWN'), { x: 10, y: 11 });
  assert.deepEqual(getNextHead(head, 'LEFT'), { x: 9, y: 10 });
  assert.deepEqual(getNextHead(head, 'RIGHT'), { x: 11, y: 10 });
});

test('isWallCollision detects perimeter boundaries correctly', () => {
  const width = 20;
  const height = 20;

  assert.equal(isWallCollision({ x: 0, y: 0 }, width, height), false);
  assert.equal(isWallCollision({ x: 19, y: 19 }, width, height), false);
  assert.equal(isWallCollision({ x: -1, y: 10 }, width, height), true);
  assert.equal(isWallCollision({ x: 20, y: 10 }, width, height), true);
  assert.equal(isWallCollision({ x: 10, y: -1 }, width, height), true);
  assert.equal(isWallCollision({ x: 10, y: 20 }, width, height), true);
});

test('isSelfCollision detects intersection with snake body segments', () => {
  const body = [
    { x: 10, y: 9 },
    { x: 9, y: 9 },
    { x: 8, y: 9 }
  ];

  assert.equal(isSelfCollision({ x: 9, y: 9 }, body), true);
  assert.equal(isSelfCollision({ x: 10, y: 10 }, body), false);
});

test('spawnFood never spawns on an occupied snake tile', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ];
  // 2x2 grid, so only (1, 1) is free
  const food = spawnFood(snake, 2, 2, () => 0);
  assert.deepEqual(food, { x: 1, y: 1 });
});

test('calculateSpeed ramps up every 5 food items and respects min clamp', () => {
  const base = calculateSpeed(0);
  assert.equal(base, 150);
  const lvl1 = calculateSpeed(4);
  assert.equal(lvl1, 150);
  const lvl2 = calculateSpeed(5);
  assert.equal(lvl2, 138); // 150 - 12
  const lvl3 = calculateSpeed(10);
  assert.equal(lvl3, 126); // 150 - 24
  const capped = calculateSpeed(100);
  assert.equal(capped, 65); // Min clamp
});

test('calculateScore awards 10 points per food item', () => {
  assert.equal(calculateScore(0), 0);
  assert.equal(calculateScore(1), 10);
  assert.equal(calculateScore(7), 70);
});
