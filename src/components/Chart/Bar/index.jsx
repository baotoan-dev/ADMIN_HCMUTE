import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomBar = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" aspect={2 / 1}>
      <BarChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#8884d8" />
        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBar;
