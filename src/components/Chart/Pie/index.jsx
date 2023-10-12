import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

const CustomPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" aspect={2 / 1}>
      <PieChart
        width={730}
        height={250}
        margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
      >
        <Pie
          data={data}
          dataKey="quantity"
          nameKey="status_value"
          cx="50%"
          cy="50%"
          outerRadius={200}
          fill="#8884d8"
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
