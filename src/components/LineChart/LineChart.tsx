import {
  LineChart as RCLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';

export interface SeriesPoint {
  x: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

interface Props {
  data: SeriesPoint[];
  unit: string;
  childPoint?: {
    x: number;
    y: number;
  };
}

export default function LineChart({ data, unit, childPoint }: Readonly<Props>) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-soft">
      <div className="font-semibold mb-2">Percentile Curves</div>
      <div className="h-64">
        <ResponsiveContainer>
          <RCLineChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" tickFormatter={(v) => `${v}`} />
            <YAxis tickFormatter={(v) => `${v}${unit}`} />
            <Tooltip
              formatter={(v: number) => `${v}${unit}`}
              labelFormatter={(l: number) => `Age ${l} mo`}
            />
            <Line type="monotone" dataKey="p3" dot={false} />
            <Line type="monotone" dataKey="p15" dot={false} />
            <Line type="monotone" dataKey="p50" dot={false} />
            <Line type="monotone" dataKey="p85" dot={false} />
            <Line type="monotone" dataKey="p97" dot={false} />
            {childPoint && <ReferenceDot x={childPoint.x} y={childPoint.y} r={5} />}
          </RCLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
