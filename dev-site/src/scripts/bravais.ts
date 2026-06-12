

export interface CifAtom {
  elem: string;
  x: number; 
  y: number;
  z: number;
}

export interface ParsedCif {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
  atoms: CifAtom[];
  symops: string[];
  centering: string;
}

export interface CartAtom {
  elem: string;
  x: number;
  y: number;
  z: number;
}

const EPS = 1e-3;

const num = (s: string) => parseFloat(s.replace(/\(.*?\)/g, ''));

export function parseCif(text: string): ParsedCif {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const cell: Record<string, number> = {};
  const atoms: CifAtom[] = [];
  const symops: string[] = [];
  let hm = '';
  let centeringTag = '';

  const cellKeys: Record<string, string> = {
    _cell_length_a: 'a',
    _cell_length_b: 'b',
    _cell_length_c: 'c',
    _cell_angle_alpha: 'alpha',
    _cell_angle_beta: 'beta',
    _cell_angle_gamma: 'gamma',
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.startsWith('#')) continue;

    const [tag, ...rest] = line.split(/\s+/);
    if (cellKeys[tag] && rest.length) cell[cellKeys[tag]] = num(rest[0]);
    if (tag === '_symmetry_space_group_name_H-M' || tag === '_space_group_name_H-M_alt')
      hm = rest.join(' ').replace(/['"]/g, '').trim();
    if (tag === '_bravais_centering' && rest.length) centeringTag = rest[0].replace(/['"]/g, '');

    if (tag !== 'loop_') continue;

    const headers: string[] = [];
    let j = i + 1;
    while (j < lines.length && lines[j].startsWith('_')) headers.push(lines[j++].split(/\s+/)[0]);

    const isAtoms = headers.some((h) => h.startsWith('_atom_site_fract_x'));
    const isSym = headers.some(
      (h) => h === '_symmetry_equiv_pos_as_xyz' || h === '_space_group_symop_operation_xyz',
    );
    if (!isAtoms && !isSym) continue;

    for (; j < lines.length; j++) {
      const row = lines[j];
      if (!row || row.startsWith('_') || row.startsWith('loop_') || row.startsWith('data_')) break;
      if (isSym) {
        symops.push(row.replace(/^\d+\s+/, '').replace(/['"]/g, '').trim());
        continue;
      }
      const cols = row.split(/\s+/);
      if (cols.length < headers.length) continue;
      const get = (name: string) => cols[headers.indexOf(name)];
      const elemRaw = get('_atom_site_type_symbol') ?? get('_atom_site_label') ?? '';
      const elem = elemRaw.replace(/[^A-Za-z].*$/, '');
      atoms.push({
        elem: elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase(),
        x: num(get('_atom_site_fract_x')),
        y: num(get('_atom_site_fract_y')),
        z: num(get('_atom_site_fract_z')),
      });
    }
    i = j - 1;
  }

  return {
    a: cell.a,
    b: cell.b,
    c: cell.c,
    alpha: cell.alpha ?? 90,
    beta: cell.beta ?? 90,
    gamma: cell.gamma ?? 90,
    atoms,
    symops,
    centering: (centeringTag || hm.charAt(0) || 'P').toUpperCase(),
  };
}


function evalComponent(expr: string, x: number, y: number, z: number): number {
  let v = 0;

  const terms = expr.replace(/\s+/g, '').match(/[+-]?[^+-]+/g) ?? [];
  for (const t of terms) {
    const sign = t.startsWith('-') ? -1 : 1;
    const body = t.replace(/^[+-]/, '');
    if (body.includes('x')) v += sign * (parseFloat(body.replace('x', '')) || 1) * x;
    else if (body.includes('y')) v += sign * (parseFloat(body.replace('y', '')) || 1) * y;
    else if (body.includes('z')) v += sign * (parseFloat(body.replace('z', '')) || 1) * z;
    else if (body.includes('/')) {
      const [p, q] = body.split('/');
      v += (sign * parseFloat(p)) / parseFloat(q);
    } else v += sign * parseFloat(body);
  }
  return v;
}

function applySymop(op: string, atom: CifAtom): CifAtom {
  const [ex, ey, ez] = op.split(',');
  return {
    elem: atom.elem,
    x: evalComponent(ex, atom.x, atom.y, atom.z),
    y: evalComponent(ey, atom.x, atom.y, atom.z),
    z: evalComponent(ez, atom.x, atom.y, atom.z),
  };
}

const CENTERING: Record<string, [number, number, number][]> = {
  P: [],
  A: [[0, 0.5, 0.5]],
  B: [[0.5, 0, 0.5]],
  C: [[0.5, 0.5, 0]],
  I: [[0.5, 0.5, 0.5]],
  F: [
    [0, 0.5, 0.5],
    [0.5, 0, 0.5],
    [0.5, 0.5, 0],
  ],
  R: [
    [2 / 3, 1 / 3, 1 / 3],
    [1 / 3, 2 / 3, 2 / 3],
  ],
};

const wrap = (v: number) => {
  let w = v - Math.floor(v);
  if (w > 1 - EPS) w = 0; 
  return w;
};

export function expandToCell(parsed: ParsedCif): CifAtom[] {
  const ops = parsed.symops.length ? parsed.symops : ['x,y,z'];
  const shifts: [number, number, number][] = [[0, 0, 0], ...(CENTERING[parsed.centering] ?? [])];

  const out: CifAtom[] = [];
  const seen = new Set<string>();
  for (const atom of parsed.atoms) {
    for (const op of ops) {
      const moved = applySymop(op, atom);
      for (const [sx, sy, sz] of shifts) {
        const candidate: CifAtom = {
          elem: atom.elem,
          x: wrap(moved.x + sx),
          y: wrap(moved.y + sy),
          z: wrap(moved.z + sz),
        };
        const key = `${candidate.elem}:${candidate.x.toFixed(3)},${candidate.y.toFixed(3)},${candidate.z.toFixed(3)}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push(candidate);
        }
      }
    }
  }
  return out;
}

export function replicateBoundary(atoms: CifAtom[]): CifAtom[] {
  const out: CifAtom[] = [];
  for (const atom of atoms) {
    const xs = Math.abs(atom.x) < EPS ? [atom.x, atom.x + 1] : [atom.x];
    const ys = Math.abs(atom.y) < EPS ? [atom.y, atom.y + 1] : [atom.y];
    const zs = Math.abs(atom.z) < EPS ? [atom.z, atom.z + 1] : [atom.z];
    for (const x of xs) for (const y of ys) for (const z of zs) out.push({ elem: atom.elem, x, y, z });
  }
  return out;
}


type Mat3 = [number, number, number, number, number, number, number, number, number];

function cellMatrix(p: ParsedCif): Mat3 {
  const rad = Math.PI / 180;
  const ca = Math.cos(p.alpha * rad);
  const cb = Math.cos(p.beta * rad);
  const cg = Math.cos(p.gamma * rad);
  const sg = Math.sin(p.gamma * rad);
  const cy = (p.c * (ca - cb * cg)) / sg;
  const cz = Math.sqrt(Math.max(0, p.c * p.c - p.c * cb * (p.c * cb) - cy * cy));
  return [p.a, p.b * cg, p.c * cb, 0, p.b * sg, cy, 0, 0, cz];
}

function toCart(m: Mat3, atom: CifAtom): CartAtom {
  return {
    elem: atom.elem,
    x: m[0] * atom.x + m[1] * atom.y + m[2] * atom.z,
    y: m[3] * atom.x + m[4] * atom.y + m[5] * atom.z,
    z: m[6] * atom.x + m[7] * atom.y + m[8] * atom.z,
  };
}

export interface CellModel {
  atoms: CartAtom[];
  edges: [CartAtom, CartAtom][];
}

export function buildModel(cifText: string): CellModel {
  const parsed = parseCif(cifText);
  const m = cellMatrix(parsed);
  const atoms = replicateBoundary(expandToCell(parsed)).map((a) => toCart(m, a));

  const corner = (x: number, y: number, z: number) => toCart(m, { elem: '', x, y, z });
  const edges: [CartAtom, CartAtom][] = [];
  for (const [u, v] of [
    [[0, 0, 0], [1, 0, 0]], [[0, 1, 0], [1, 1, 0]], [[0, 0, 1], [1, 0, 1]], [[0, 1, 1], [1, 1, 1]],
    [[0, 0, 0], [0, 1, 0]], [[1, 0, 0], [1, 1, 0]], [[0, 0, 1], [0, 1, 1]], [[1, 0, 1], [1, 1, 1]],
    [[0, 0, 0], [0, 0, 1]], [[1, 0, 0], [1, 0, 1]], [[0, 1, 0], [0, 1, 1]], [[1, 1, 0], [1, 1, 1]],
  ] as const) {
    edges.push([corner(...u), corner(...v)]);
  }
  return { atoms, edges };
}

export function toXyz(atoms: CartAtom[]): string {
  return `${atoms.length}\nbravais cell\n${atoms
    .map((a) => `${a.elem} ${a.x.toFixed(5)} ${a.y.toFixed(5)} ${a.z.toFixed(5)}`)
    .join('\n')}\n`;
}
