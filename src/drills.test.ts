import { describe, expect, it } from 'vitest';
import { distanceToSegment, scoreStroke, targetsFor } from './drills';

describe('geometric scoring', () => {
  it('measures the shortest distance to a segment', () => {
    expect(distanceToSegment({ x: 5, y: 4 }, [{ x: 0, y: 0 }, { x: 10, y: 0 }])).toBe(4);
  });

  it('gives an exact target stroke a full score', () => {
    const target = targetsFor('line', 100, 100);
    const points = [{ x: 12, y: 70 }, { x: 50, y: 50 }, { x: 88, y: 30 }];
    expect(scoreStroke(points, target)).toEqual({ deviation: 0, score: 100 });
  });

  it('lowers the score when a stroke moves away from the target', () => {
    const target = targetsFor('line', 100, 100);
    const near = scoreStroke([{ x: 12, y: 70 }, { x: 88, y: 30 }], target);
    const far = scoreStroke([{ x: 12, y: 10 }, { x: 88, y: 10 }], target);
    expect(near.score).toBeGreaterThan(far.score);
  });

  it('defines every advertised drill target', () => {
    for (const id of ['line', 'ellipse', 'box', 'one-point', 'two-point', 'orbit', 'radar', 'gantry']) {
      expect(targetsFor(id, 800, 450).length).toBeGreaterThan(0);
    }
  });
});
