// components/Histogram.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Cell } from 'recharts';

interface HistogramProps {
  data: number[];
  labels?: string[];
}

const formatTick = (tick: string, index: number, labels: string[] | undefined) => {
    if (!labels) {
      return tick;
    }
  
    if (index === 1) {
      return 'Less than -40%';
    }
  
    if (index === labels.length - 1) {
      return 'More than 40%';
    }
  
    const [start, end] = tick.split(" to ");
    return `${start}-${end}`;
  };
  
  
  
const CustomizedAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={20} textAnchor="end" fill="#666" transform="rotate(-35)">
        {payload.value}
      </text>
    </g>
  );
};

const Histogram: React.FC<HistogramProps> = ({ data, labels }) => {
  const chartData = data.map((value, index) => ({
    value,
    label: labels ? labels[index] : undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 100, left: 20 }} barSize={20}>
        <XAxis dataKey="label" tick={<CustomizedAxisTick />} tickFormatter={(tick, index) => formatTick(tick, index, labels)} />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="value" fill="#82ca9d">
          {data.map((value, index) => (
            <Cell key={index} fill={index === 0 || index === data.length - 1 ? '#f44336' : '#82ca9d'} />
          ))}
        </Bar>
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Histogram;
