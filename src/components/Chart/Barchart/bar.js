import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


export let ExperienceDistribution = (props) => {
  const experienceDistribution = props.data;
  let totalCompany = 0;

  experienceDistribution.forEach((d) => {
    totalCompany += d.company;
  });

  let CustomTooltip = ({ active, payload, label }) => {
    if (!active) {
      return null;
    }

    return (
      <div className="tooltip">
        <p className="label">{`Month: ${label}`}</p>
        <p className="data">{`Total: ${payload[0].value}`}</p>
      </div>
    );
  };

  function yAxis(value) {
    return value
  }

  let CompanyBox = (props) => {
    let { x, y, width, height, fill } = props;

    return (
      <svg>
        <defs>
          <linearGradient id="CompanyBox" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: fill[0], stopOpacity: 1 }} />
            <stop
              offset="100%"
              style={{ stopColor: fill[1], stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          d={`m${x},${height + y} v-${height} c0-2.1,1.7-3.8,3.8-3.8 h${width - 8
            } c2.1,0,3.8,1.7,3.8,3.8 v${height} z`}
          fill="url(#CompanyBox)"
        />
      </svg>
    );
  };

  let Cursor = (props) => {
    let { x, y, width, height, payload } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          rx="5"
          width={width}
          height={height + 30}
          fill="#ECF4FF"
        />
        <text
          x={x + width / 2}
          y={y + height + 17}
          textAnchor="middle"
          fill="#191818"
          fontSize="12"
          fontWeight="700"
        >
          {payload[0].payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className="bar-chart">
      <div className="chart">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={experienceDistribution}
            margin={{ top: 50, right: 25, bottom: 25, left: 15 }}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              tick={{ fontSize: 12, fill: '#999999' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={yAxis}
              tick={{ fontSize: 12, fill: '#999999' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={<Cursor />} />
            <CartesianGrid vertical={false} />
            <Bar
              dataKey="company"
              barSize={18}
              fill={['#4186EA', '#3253CB']}
              shape={<CompanyBox />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
