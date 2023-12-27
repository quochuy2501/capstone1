import UserLayout from '../../components/common/user-layout';
import { Button, Result } from 'antd';

const PaymentFailed = () => {
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
          title="Thanh toán thất bại!"
          subTitle="Quá trình đặt sân của bạn chưa hoàn tất."
          extra={
            <Button type="primary" key="console">
              Go Console
            </Button>
          }
        />
      </div>
    </UserLayout>
  );
};

export default PaymentFailed;
