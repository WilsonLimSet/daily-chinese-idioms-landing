import {
  DIMENSION_ORDER,
  type DimensionLevels,
  type DimensionId,
  type Level,
} from '@/src/lib/sbti-engine';

const LEVEL_VALUE: Record<Level, number> = { L: 1, M: 2, H: 3 };

type Props = {
  levels: DimensionLevels;
  dimensionLabels: Record<string, string>;
  size?: number;
};

export default function RadarChart({ levels, dimensionLabels, size = 360 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const n = DIMENSION_ORDER.length;

  const points = DIMENSION_ORDER.map((dim, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const value = LEVEL_VALUE[levels[dim as DimensionId] ?? 'M'];
    const r = (value / 3) * radius;
    return {
      dim,
      angle,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      labelX: cx + (radius + 22) * Math.cos(angle),
      labelY: cy + (radius + 22) * Math.sin(angle),
    };
  });

  const pathD =
    points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ') + ' Z';

  const rings = [1 / 3, 2 / 3, 1].map(t => ({ r: radius * t, t }));

  const axes = DIMENSION_ORDER.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto block h-auto w-full max-w-sm"
      role="img"
      aria-label="Your SBTI dimension profile"
    >
      {rings.map(ring => (
        <circle
          key={ring.t}
          cx={cx}
          cy={cy}
          r={ring.r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
          strokeDasharray={ring.t === 1 ? 'none' : '2 3'}
        />
      ))}
      {axes.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="#f3f4f6" strokeWidth={1} />
      ))}
      <path d={pathD} fill="rgba(220, 38, 38, 0.08)" stroke="#dc2626" strokeWidth={1.5} />
      {points.map(p => (
        <circle key={p.dim} cx={p.x} cy={p.y} r={3.5} fill="#dc2626" />
      ))}
      {points.map(p => (
        <text
          key={`label-${p.dim}`}
          x={p.labelX}
          y={p.labelY}
          fontSize={9}
          fontWeight={600}
          fill="#6b7280"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          {dimensionLabels[p.dim] ?? p.dim}
        </text>
      ))}
    </svg>
  );
}
