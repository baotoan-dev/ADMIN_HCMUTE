import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomArea = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" aspect={2 / 1}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <defs>
          <linearGradient id="quantity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" stroke="#8884d8" tick={{ fill: '#8884d8' }} />
        <YAxis stroke="#8884d8" tick={{ fill: '#8884d8' }} />
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #8884d8' }}
          labelStyle={{ color: '#8884d8', fontWeight: 'bold' }}
          formatter={(value) => `${value} units`}
        />
        <Area
          type="monotone"
          dataKey="quantity"
          stroke="#ff7300"
          fillOpacity={1}
          fill="url(#quantity)"
          animationBegin={1000} // Thời gian bắt đầu hiệu ứng
          animationDuration={2000} // Thời gian thực hiện hiệu ứng
          dot={{ stroke: '#ff7300', fill: '#fff', strokeWidth: 3, r: 6 }}
          activeDot={{ stroke: '#ff7300', fill: '#ff7300', strokeWidth: 3, r: 8 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomArea;
