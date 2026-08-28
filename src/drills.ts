export type Point = { x: number; y: number };
export type Segment = [Point, Point];

export type Drill = {
  id: string;
  name: string;
  short: string;
  instruction: string;
  cue: string;
  minStrokes: number;
  paid?: boolean;
};

export const drills: Drill[] = [
  { id: 'line', name: 'Straight line', short: 'Line', instruction: 'Draw from the left marker to the right marker in one motion.', cue: 'Look at the end marker. Move from your shoulder.', minStrokes: 1 },
  { id: 'ellipse', name: 'Ellipse', short: 'Ellipse', instruction: 'Trace the ellipse once. Keep your speed even through each turn.', cue: 'Ghost the shape first. Draw through the curve.', minStrokes: 1 },
  { id: 'box', name: 'Box', short: 'Box', instruction: 'Trace each box edge. Start with the long outside lines.', cue: 'Commit to each corner. Do not patch a line.', minStrokes: 7 },
  { id: 'one-point', name: 'One-point perspective', short: '1-point', instruction: 'Draw the box edges toward the single vanishing point.', cue: 'Aim past the vanishing point, then lift.', minStrokes: 8 },
  { id: 'two-point', name: 'Two-point perspective', short: '2-point', instruction: 'Build the box toward both vanishing points.', cue: 'Keep verticals upright. Aim each side at its point.', minStrokes: 9 },
  { id: 'orbit', name: 'Orbital rings', short: 'Orbit', instruction: 'Trace three tilted rings around the shared center.', cue: 'Keep the center fixed while each ring turns.', minStrokes: 3, paid: true },
  { id: 'radar', name: 'Radar spokes', short: 'Radar', instruction: 'Pull eight straight spokes from the center.', cue: 'Return to the same center before each stroke.', minStrokes: 8, paid: true },
  { id: 'gantry', name: 'Gantry depth', short: 'Gantry', instruction: 'Trace the repeated frames as they shrink toward the horizon.', cue: 'Keep uprights parallel and depth lines converging.', minStrokes: 12, paid: true },
];

const point = (x: number, y: number, width: number, height: number): Point => ({ x: x * width, y: y * height });
const segment = (a: [number, number], b: [number, number], width: number, height: number): Segment => [point(a[0], a[1], width, height), point(b[0], b[1], width, height)];

function ellipseSegments(cx: number, cy: number, rx: number, ry: number, width: number, height: number, tilt = 0): Segment[] {
  const pieces: Segment[] = [];
  const count = 64;
  const ellipsePoint = (angle: number): Point => {
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    return point(cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt), width, height);
  };
  for (let index = 0; index < count; index += 1) {
    pieces.push([ellipsePoint((index / count) * Math.PI * 2), ellipsePoint(((index + 1) / count) * Math.PI * 2)]);
  }
  return pieces;
}

export function targetsFor(id: string, width: number, height: number): Segment[] {
  const s = (a: [number, number], b: [number, number]) => segment(a, b, width, height);
  if (id === 'line') return [s([0.12, 0.7], [0.88, 0.3])];
  if (id === 'ellipse') return ellipseSegments(0.5, 0.5, 0.31, 0.27, width, height, -0.18);
  if (id === 'box') {
    const front: Segment[] = [s([0.28, 0.28], [0.65, 0.25]), s([0.65, 0.25], [0.67, 0.65]), s([0.67, 0.65], [0.3, 0.69]), s([0.3, 0.69], [0.28, 0.28])];
    return [...front, s([0.28, 0.28], [0.43, 0.17]), s([0.65, 0.25], [0.79, 0.16]), s([0.43, 0.17], [0.79, 0.16]), s([0.79, 0.16], [0.67, 0.65])];
  }
  if (id === 'one-point') {
    const vp: [number, number] = [0.5, 0.2];
    return [s([0.27, 0.45], [0.64, 0.45]), s([0.64, 0.45], [0.64, 0.77]), s([0.64, 0.77], [0.27, 0.77]), s([0.27, 0.77], [0.27, 0.45]), s([0.27, 0.45], vp), s([0.64, 0.45], vp), s([0.64, 0.77], vp), s([0.27, 0.77], vp)];
  }
  if (id === 'two-point') {
    const left: [number, number] = [0.06, 0.28];
    const right: [number, number] = [0.94, 0.28];
    return [s([0.5, 0.39], [0.5, 0.78]), s([0.5, 0.39], left), s([0.5, 0.39], right), s([0.5, 0.78], left), s([0.5, 0.78], right), s([0.31, 0.57], [0.31, 0.68]), s([0.69, 0.57], [0.69, 0.68]), s([0.31, 0.57], right), s([0.69, 0.57], left)];
  }
  if (id === 'orbit') return [...ellipseSegments(0.5, 0.5, 0.33, 0.13, width, height, -0.35), ...ellipseSegments(0.5, 0.5, 0.33, 0.13, width, height, 0.35), ...ellipseSegments(0.5, 0.5, 0.22, 0.22, width, height)];
  if (id === 'radar') {
    return Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * Math.PI * 2;
      return [point(0.5, 0.5, width, height), point(0.5 + Math.cos(angle) * 0.34, 0.5 + Math.sin(angle) * 0.34, width, height)];
    });
  }
  const frames: Segment[] = [];
  for (const inset of [0, 0.09, 0.17]) {
    const left = 0.2 + inset;
    const right = 0.8 - inset;
    const top = 0.19 + inset * 0.6;
    const bottom = 0.81 - inset * 0.6;
    frames.push(s([left, top], [right, top]), s([right, top], [right, bottom]), s([right, bottom], [left, bottom]), s([left, bottom], [left, top]));
  }
  return frames;
}

export function distanceToSegment(p: Point, [a, b]: Segment): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (dx === 0 && dy === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  const ratio = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - (a.x + ratio * dx), p.y - (a.y + ratio * dy));
}

export function scoreStroke(points: Point[], targets: Segment[]): { deviation: number; score: number } {
  if (points.length < 2 || targets.length === 0) return { deviation: 100, score: 0 };
  const sampled = points.filter((_, index) => index % Math.max(1, Math.floor(points.length / 120)) === 0);
  const deviation = sampled.reduce((sum, item) => sum + Math.min(...targets.map((target) => distanceToSegment(item, target))), 0) / sampled.length;
  const score = Math.max(0, Math.min(100, Math.round(100 - deviation * 4)));
  return { deviation: Math.round(deviation * 10) / 10, score };
}
