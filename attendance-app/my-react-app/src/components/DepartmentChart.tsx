import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './DepartmentChart.module.css';

type DepartmentChartProps = {
  data: Array<{
    name: string;
    value: number;
  }>;
};

const COLORS = ['#667eea', '#48bb78', '#ed8936', '#f56565', '#38b2ac', '#9f7aea'];

export function DepartmentChart({ data }: DepartmentChartProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Department Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
