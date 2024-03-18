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

import { experienceDistribution, salaryDistribution } from './data.js';

export let ExperienceDistribution = (props) => {
  let totalCompany = 0;
  let totalCompetition = 0;

  experienceDistribution.forEach((d) => {
    totalCompany += d.company;
    totalCompetition += d.competition;
  });

  function displayPercent(key, value) {
    return key === 'company'
      ? Math.round((value / totalCompany) * 100)
      : Math.round((value / totalCompetition) * 100);
  }

  let CustomTooltip = ({ active, payload, label }) => {
    if (!active) {
      return <div></div>;
    }

    let exp = label.replace(/y/g, '');
    let [company, competition] = payload;

    return (
      <div className="tooltip">
        <p className="weight700 label">
          {exp} {exp === '0-1' ? 'year' : 'years'} Experience
        </p>
        {payload.map((p) => {
          return (
            <p className="data">
              <span className="dot" style={{ borderColor: p.fill[1] }}></span>
              <span className="key">{p.dataKey}</span>
              <span>{displayPercent(p.dataKey, p.value)}%</span>
            </p>
          );
        })}
      </div>
    );
  };

  function yAxis(value) {
    let per = Math.round((value / totalCompany) * 100);

    if (per > 0) {
      return per + '%';
    }

    return 0;
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
          d={`m${x},${height + y} v-${height} c0-2.1,1.7-3.8,3.8-3.8 h${
            width - 8
          } c2.1,0,3.8,1.7,3.8,3.8 v${height} z`}
          fill="url(#CompanyBox)"
        />
      </svg>
    );
  };

  let CompetitionBox = (props) => {
    let { x, y, width, height, fill } = props;

    return (
      <svg>
        <defs>
          <linearGradient id="CompetitionBox" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: fill[0], stopOpacity: 1 }} />
            <stop
              offset="100%"
              style={{ stopColor: fill[1], stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          d={`m${x},${height + y} v-${height} c0-2.1,1.7-3.8,3.8-3.8 h${
            width - 8
          } c2.1,0,3.8,1.7,3.8,3.8 v${height} z`}
          fill="url(#CompetitionBox)"
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
          text-anchor="middle"
          fill="#191818"
          font-size="12"
          font-weight="700"
        >
          {payload[0].payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className="bar-chart">
      <h1>Experience distribution</h1>

      <div class="chart">
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
            <Bar
              dataKey="competition"
              barSize={18}
              fill={['#FA8586', '#E8647B']}
              shape={<CompetitionBox />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export let SalaryDistribution = (porps) => {
  let totalSalary = 0;
  let totalCandidates = 0;

  salaryDistribution.forEach((d) => {
    totalSalary += d.salary;
    totalCandidates += d.candidates;
  });

  function toK(value) {
    return value / 1000 + 'K';
  }

  function formatSalary(value) {
    return value / 100000 + ' L';
  }

  let CustomTooltip = ({ active, payload, label }) => {
    let [data] = payload;

    if (!active || !data) {
      return <div></div>;
    }

    return (
      <div className="tooltip center">
        <p>Candidates</p>
        <h2 className="weight700">{toK(data.value)}</h2>
      </div>
    );
  };

  let Cursor = (props) => {
    let { x, y, width, height, payload } = props;
    return (
      <g>
        <rect
          x={x}
          y={y - 20}
          rx="5"
          width={width}
          height={height + 80}
          fill="#ECF4FF"
        />
        <text
          x={x + width / 2}
          y={y + height + 17}
          text-anchor="middle"
          fill="#191818"
          font-size="12"
          font-weight="700"
        >
          {payload[0].payload.exp}
        </text>
        <text
          x={x + width / 2}
          y={y + height + 47}
          text-anchor="middle"
          fill="#191818"
          font-size="12"
          font-weight="700"
        >
          {formatSalary(payload[0].payload.salary)}
        </text>
      </g>
    );
  };

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
          d={`m${x},${height + y} v-${height} c0-2.1,1.7-3.8,3.8-3.8 h${
            width - 8
          } c2.1,0,3.8,1.7,3.8,3.8 v${height} z`}
          fill="url(#CompanyBox)"
        />
      </svg>
    );
  };

  return (
    <div className="bar-chart">
      <h1>Salary distribution</h1>

      <div class="chart">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={salaryDistribution}
            margin={{ top: 50, right: 25, bottom: 25, left: 16 }}
          >
            <XAxis
              dataKey="exp"
              tickLine={false}
              tick={{ fontSize: 12, fill: '#999999' }}
              label={{
                value: 'Experience',
                offset: -70,
                position: 'insideLeft',
                fill: '#999999',
                fontSize: 14,
              }}
            />
            <XAxis
              dataKey="salary"
              label={{
                value: 'Median CTC',
                offset: -70,
                position: 'insideLeft',
                fill: '#999999',
                fontSize: 14,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatSalary}
              tick={{ fontSize: 12, fill: '#999999' }}
              xAxisId="1"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              dataKey="candidates"
              tickFormatter={toK}
              tick={{ fontSize: 12, fill: '#999999' }}
              label={{
                value: 'Candidates',
                offset: -38,
                position: 'insideTop',
                fill: '#999999',
                fontSize: 14,
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={<Cursor />} />
            <CartesianGrid vertical={false} />
            <Bar
              dataKey="candidates"
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
