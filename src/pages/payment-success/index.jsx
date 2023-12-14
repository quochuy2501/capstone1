import UserLayout from '../../components/common/user-layout';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <UserLayout>
      <div
        style={{
          display: 'flex',
          height: '60vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle="Quá trình đặt sân của bạn đã hoàn tất."
          extra={[
            <Button type="primary" key="console" onClick={() => navigate('/')}>
              Trở về trang chủ
            </Button>
          ]}
        />
      </div>
    </UserLayout>
  );
};

export default PaymentSuccess;
