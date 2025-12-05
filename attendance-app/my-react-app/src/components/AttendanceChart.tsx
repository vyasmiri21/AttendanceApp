import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from './AttendanceChart.module.css';

type AttendanceChartProps = {
  data: Array<{
    date: string;
    present: number;
    absent: number;
    late: number;
  }>;
};

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>7-Day Attendance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
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
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '0.875rem'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="present" 
            stroke="#48bb78" 
            strokeWidth={2}
            name="Present"
            dot={{ fill: '#48bb78', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="absent" 
            stroke="#f56565" 
            strokeWidth={2}
            name="Absent"
            dot={{ fill: '#f56565', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="late" 
            stroke="#ed8936" 
            strokeWidth={2}
            name="Late"
            dot={{ fill: '#ed8936', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
