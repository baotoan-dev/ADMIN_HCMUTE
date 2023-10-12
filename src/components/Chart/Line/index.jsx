import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomLine = ({ data, name }) => {
  return (
    <ResponsiveContainer width="100%" aspect={2 / 1}>
      <LineChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line name={name} type="monotone" dataKey="quantity" stroke="#8884d8" />
        {/* <Line
                    name="uv of pages"
                    type="monotone"
                    dataKey="uv"
                    stroke="#82ca9d"
                /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLine;
