import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RiskRadarProps {
  dimensions: Array<{
    label: string;
    value: number; // 0-100
  }>;
}

export const RiskRadar = ({ dimensions }: RiskRadarProps) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 5;

  // Create points for the polygon based on dimension values
  const points = dimensions.map((dim, index) => {
    const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2;
    const value = (dim.value / 100) * radius;
    const x = center + value * Math.cos(angle);
    const y = center + value * Math.sin(angle);
    return { x, y, angle, value: dim.value, label: dim.label };
  });

  // Create axis points (full radius)
  const axisPoints = dimensions.map((dim, index) => {
    const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, angle, label: dim.label };
  });

  // Create level circles
  const levelCircles = Array.from({ length: levels }, (_, i) => {
    const levelRadius = (radius / levels) * (i + 1);
    return levelRadius;
  });

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle>Risk Profile Radar</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visual representation of your risk dimensions (0-100 scale)
        </p>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circles */}
            {levelCircles.map((levelRadius, index) => (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={levelRadius}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity={0.3}
              />
            ))}

            {/* Axis lines */}
            {axisPoints.map((point, index) => (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity={0.3}
              />
            ))}

            {/* Score labels for levels */}
            {levelCircles.map((levelRadius, index) => (
              <text
                key={index}
                x={center + levelRadius + 5}
                y={center + 5}
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
                opacity={0.6}
              >
                {((index + 1) * 20)}
              </text>
            ))}

            {/* Data polygon */}
            <polygon
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="hsl(var(--primary) / 0.2)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
              />
            ))}

            {/* Axis labels */}
            {axisPoints.map((point, index) => {
              const labelOffset = 20;
              const labelX = center + (radius + labelOffset) * Math.cos(point.angle);
              const labelY = center + (radius + labelOffset) * Math.sin(point.angle);
              
              return (
                <text
                  key={index}
                  x={labelX}
                  y={labelY}
                  fontSize="11"
                  fontWeight="500"
                  fill="hsl(var(--foreground))"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {point.label}
                </text>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {dimensions.map((dim, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">
                  {dim.label}: {Math.round(dim.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};