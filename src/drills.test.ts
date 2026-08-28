import { describe, expect, it } from 'vitest';
import { coveredTargetIndexes, distanceToSegment, scoreStroke, targetCoverage, targetsFor } from './drills';

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

  it('requires a stroke to cover most of a guide segment, not merely touch it', () => {
    const targets = targetsFor('box', 800, 450);
    const [start] = targets[0];
    expect(coveredTargetIndexes([start, start], targets)).toEqual([]);
    expect(coveredTargetIndexes([targets[0][0], targets[0][1]], targets)).toEqual([0]);
  });

  it('counts distinct box edges and does not let one edge satisfy the drill', () => {
    const targets = targetsFor('box', 800, 450);
    const repeatedFirstEdge = [targets[0], targets[0], targets[0]].map(([a, b]) => [a, b]);
    expect(targetCoverage(repeatedFirstEdge, targets)).toEqual([0]);
    expect(targetCoverage(targets.map(([a, b]) => [a, b]), targets)).toHaveLength(8);
  });
});
