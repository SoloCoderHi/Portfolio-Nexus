import { Area, AreaChart, ResponsiveContainer } from "recharts";

type SparklineChartProps = {
  data: { v: number }[];
  color?: string;
};

export const SparklineChart = ({
  data,
  color = "#10b981",
}: SparklineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data}>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          fill={color}
          fillOpacity={0.2}
          strokeWidth={1.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
