// Diffraction pattern drawn around the focal point while the magnification is changing.
// Its strength follows the zoom speed, so it shows up while scrolling or dragging the ruler
// and fades out at rest.
//
// - Light zone (naked eye, optical): an Airy pattern, the diffraction limit of a circular
//   aperture. Bright rings sit at the maxima of [2·J1(x)/x]², and each ring is drawn once per
//   wavelength with radius ∝ λ, so the colors separate into fringes just as white light does.
// - Electron zone (SEM onward): the pattern of an FCC crystal. Debye–Scherrer rings sit at
//   radius ∝ √(h²+k²+l²) for the allowed reflections (h, k, l all odd or all even), and the
//   [001] zone-axis Bragg spots (h, k even) land exactly on those rings.

export interface DiffractionFrame {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  cx: number;
  cy: number;
  /** 0..1 — how fast the magnification is changing */
  energy: number;
  /** 0 = light optics, 1 = electron optics */
  grayness: number;
  /** progress of the zoom inside the current segment, 0..1 */
  p: number;
  /** journey position, used to rotate the crystal slowly */
  T: number;
}

// bright-ring positions x of the Airy function; the weights are boosted far above the
// physical 1 : 0.0175 : 0.0042 … so the outer rings stay visible
const AIRY: [number, number][] = [
  [5.136, 1],
  [8.417, 0.6],
  [11.62, 0.42],
  [14.8, 0.3],
];
// wavelength in nm → stroke color
const WAVES: [number, string][] = [
  [650, '226, 64, 64'],
  [530, '46, 168, 92'],
  [450, '58, 92, 232'],
];
// FCC reflections: (111) (200) (220) (311) (222) (400) as h²+k²+l², with relative weights
const FCC: [number, number][] = [
  [3, 1],
  [4, 0.6],
  [8, 0.45],
  [11, 0.4],
  [12, 0.16],
  [16, 0.12],
];

export function drawDiffraction(f: DiffractionFrame): void {
  const { ctx, W, H, cx, cy, energy, grayness, p, T } = f;
  if (energy < 0.004) return;
  const m = Math.min(W, H);
  ctx.save();

  // ---- light: chromatic Airy rings
  const light = energy * (1 - grayness);
  if (light > 0.004) {
    const u = m * 0.012 * (1 + 3 * p); // rings widen as the zoom goes in
    ctx.globalCompositeOperation = 'source-over';
    for (const [x, w] of AIRY) {
      for (const [lambda, rgb] of WAVES) {
        const k = lambda / 530;
        ctx.beginPath();
        ctx.arc(cx, cy, x * u * k, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(1, u * 0.55 * k);
        ctx.strokeStyle = `rgba(${rgb}, ${0.2 * w * light})`;
        ctx.stroke();
      }
    }
  }

  // ---- electrons: Debye–Scherrer rings + [001] Bragg spots, added as light on the dark field
  const el = energy * grayness;
  if (el > 0.004) {
    const q = m * 0.045 * (1 + 2 * p);
    ctx.globalCompositeOperation = 'lighter';
    for (const [s, w] of FCC) {
      ctx.beginPath();
      ctx.arc(cx, cy, Math.sqrt(s) * q, 0, Math.PI * 2);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(200, 212, 238, ${0.2 * w * el})`;
      ctx.stroke();
    }
    const rot = T * 0.35;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const spread = 3.6 * q; // intensity falls off away from the transmitted beam
    for (let h = -4; h <= 4; h += 2) {
      for (let k = -4; k <= 4; k += 2) {
        const gx = h * q;
        const gy = k * q;
        const g2 = gx * gx + gy * gy;
        const central = h === 0 && k === 0;
        const a = el * (central ? 1 : 0.85 * Math.exp(-g2 / (2 * spread * spread)));
        if (a < 0.01) continue;
        const sx = cx + gx * cos - gy * sin;
        const sy = cy + gx * sin + gy * cos;
        const r = (central ? 12 : 8) * (0.7 + 0.5 * energy);
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
        glow.addColorStop(0, `rgba(235, 240, 255, ${a})`);
        glow.addColorStop(0.35, `rgba(150, 180, 240, ${a * 0.45})`);
        glow.addColorStop(1, 'rgba(125, 162, 232, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}
