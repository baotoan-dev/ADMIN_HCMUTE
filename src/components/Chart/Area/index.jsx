import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomArea = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" aspect={2 / 1}>
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="quantity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" stroke="gray" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="quantity"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#quantity)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomArea;
