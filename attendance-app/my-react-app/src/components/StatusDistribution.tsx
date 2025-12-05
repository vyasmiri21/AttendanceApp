import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import styles from './StatusDistribution.module.css';

type StatusDistributionProps = {
  data: Array<{
    name: string;
    count: number;
  }>;
};

export function StatusDistribution({ data }: StatusDistributionProps) {
  const getBarColor = (name: string) => {
    switch (name) {
      case 'Present':
        return '#48bb78';
      case 'Absent':
        return '#f56565';
      case 'Late':
        return '#ed8936';
      case 'Half-Day':
        return '#38b2ac';
      default:
        return '#667eea';
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Today's Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            stroke="#718096"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="#718096"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Bar 
            dataKey="count" 
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}