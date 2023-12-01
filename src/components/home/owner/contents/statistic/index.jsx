import { useState, useEffect } from 'react';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer
} from 'recharts';
import useAxios from '../../../../../hooks/useAxios';

const Statistic = () => {
  const [profit, setProfit] = useState([]);
  const { api } = useAxios();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/owner/get-total-money');
        console.log(data.data);
        setProfit(
          Object.values(data.data).map((val, idx) => ({
            name: `Tháng ${idx + 1}`,
            'Doanh thu': val
          }))
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="50%" style={{ marginTop: '5%' }}>
      <p
        style={{
          textAlign: 'center',
          fontSize: '25px',
          marginBottom: '60px',
          color: '#1677ff',
          fontWeight: 'bold'
        }}
      >
        Doanh thu đặt sân từng tháng
      </p>
      <p style={{ fontSize: '10px', marginBottom: '10px' }}>
        Đơn vị Việt Nam đồng (VNĐ)
      </p>
      <BarChart height={250} data={profit}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Doanh thu" fill="#1677ff" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Statistic;