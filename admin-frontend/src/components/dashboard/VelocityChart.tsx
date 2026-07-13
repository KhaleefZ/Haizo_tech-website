'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Sprint 1', expected: 40, actual: 42 },
  { name: 'Sprint 2', expected: 45, actual: 40 },
  { name: 'Sprint 3', expected: 50, actual: 55 },
  { name: 'Sprint 4', expected: 55, actual: 60 },
  { name: 'Sprint 5', expected: 60, actual: 58 },
  { name: 'Sprint 6', expected: 65, actual: 72 },
];

export function VelocityChart() {
  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Sprint Velocity
        </h3>
        <span className="text-sm text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
          +12% vs last quarter
        </span>
      </div>
      
      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(5, 5, 5, 0.9)', 
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Actual Story Points"
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="expected" 
              name="Expected Velocity"
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
