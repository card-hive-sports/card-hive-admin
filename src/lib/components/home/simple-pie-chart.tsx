import {FC} from "react";

interface SimplePieChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  title: string;
}

export const SimplePieChart: FC<SimplePieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    const isLarge = sliceAngle > 180 ? 1 : 0;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${isLarge} 1 ${x2} ${y2} Z`;

    // eslint-disable-next-line react-hooks/immutability
    currentAngle = endAngle;

    return { path, color: item.color, percentage: ((item.value / total) * 100).toFixed(1) };
  });

  return (
    <div className="glass p-6 rounded-2xl h-full flex flex-col">
      <h3 className="text-white text-lg font-semibold mb-6">{title}</h3>
      <div className="flex flex-col gap-8 items-center h-full justify-center">
        <div className={"flex flex-col sm:flex-row gap-8 items-center"}>
          <svg className="w-56 h-56 flex-shrink-0" viewBox="0 0 100 100">
            {slices.map((slice, i) => (
              <path key={i} d={slice.path} fill={slice.color} />
            ))}
          </svg>
          <div className="space-y-3 flex-1 flex flex-row sm:flex-col gap-8 sm:gap-0">
            {data.map((item, i) => (
              <div key={i}>
                <div className="flex flex-col items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white/70 text-sm">{item.label}</span>
                  </div>
                  <span className="text-white font-semibold text-sm">{slices[i].percentage}%</span>
                </div>
                <p className="text-white/50 text-xs">{item.value.toLocaleString()} items</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}