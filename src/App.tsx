/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateScore, calculateSpeed } from './game/rules.ts';

export default function App() {
  // Pure logic reference to ensure typecheck passes
  const initialScore = calculateScore(0);
  const initialSpeed = calculateSpeed(0);

  return (
    <div className="hidden" data-testid="app-root" data-score={initialScore} data-speed={initialSpeed}>
      Neon Arcade Snake
    </div>
  );
}
