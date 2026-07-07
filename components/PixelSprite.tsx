import { SPRITES, type SpriteName } from "@/lib/sprites";

// Renders a sprite's pixel grid as SVG rects. shape-rendering: crispEdges is
// what keeps the pixels razor-sharp at any size — no anti-alias blur.
export default function PixelSprite({
  name,
  size = 48,
  className,
}: {
  name: SpriteName;
  size?: number;
  className?: string;
}) {
  const def = SPRITES[name];
  if (!def) return null;

  const rows = def.grid.length;
  const cols = Math.max(...def.grid.map((r) => r.length));

  const rects: React.ReactNode[] = [];
  def.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === ".") continue;
      const fill = def.palette[ch];
      if (!fill) continue;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />);
    }
  });

  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={size}
      height={(size / cols) * rows}
      className={className}
      style={{ shapeRendering: "crispEdges", imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}
